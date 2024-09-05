const express = require('express');
const router = express.Router();
const { TeacherSectionSubject } = require('../model/medium');
const { default: mongoose } = require('mongoose');
const { Score } = require('../model/ScoreModel');

// Route to assign a subject to a teacher for a specific section
router.post('/assign', async (req, res) => {
    const { teacherId, sectionId, subjects } = req.body;

    try {
        // Use findOneAndUpdate to either update the existing document or create a new one if it doesn't exist
        const assignment = await TeacherSectionSubject.findOneAndUpdate(
            { teacherId, sectionId },
            { $set: { subjects } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to get all assignments for a teacher
router.get('/teacher/:teacherId', async (req, res) => {
    const { teacherId } = req.params;

    try {
        const assignments = await TeacherSectionSubject.find({ teacherId })
            .populate('teacherId')
            .populate('sectionId')
            .populate('subjects')

        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching assignments', error: error.message });
    }
});

// Route to get all assignments for a section
router.get('/section/:sectionId', async (req, res) => {
    const { sectionId } = req.params;

    try {
        const assignments = await TeacherSectionSubject.find({ sectionId })
            .populate('teacherId')
            .populate('sectionId')
            .populate('subjectId')

        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching assignments', error: error.message });
    }
});

//Route to get only one's teacher section
router.get('/teacher/section/:teacherId',async(req,res)=>{
    const {teacherId} = req.params

    if(!mongoose.Types.ObjectId.isValid(teacherId)){
        return res.status(400).json({error:"Not valid"})
    }

    try {
        const sectionsWithSubjectsAndGrades = await TeacherSectionSubject.aggregate([
            { $match: { teacherId: new mongoose.Types.ObjectId(teacherId) } },
            {
                $lookup: {
                    from: 'sections', // Collection name for sections
                    localField: 'sectionId',
                    foreignField: '_id',
                    as: 'sectionDetails'
                }
            },
            { $unwind: '$sectionDetails' },
            {
                $lookup: {
                    from: 'grades', // Collection name for grades
                    localField: 'sectionDetails.gradeId',
                    foreignField: '_id',
                    as: 'gradeDetails'
                }
            },
            { $unwind: '$gradeDetails' },
            {
                $lookup: {
                    from: 'subjects', // Collection name for subjects
                    localField: 'subjects',
                    foreignField: '_id',
                    as: 'subjectDetails'
                }
            }
        ]);

        if (sectionsWithSubjectsAndGrades.length > 0) {
            res.status(200).json(sectionsWithSubjectsAndGrades);
        } else {
            res.status(404).json({ error: "No sections found for this section ID" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
})
//get Assign sections and subjects for a teacher by using that id
router.get('/teacher/section/one/:idForDetail', async(req,res)=>{
    const {idForDetail} = req.params

    if(!mongoose.Types.ObjectId.isValid(idForDetail)){
        return res.status(400).json({error:"Not valid"})
    }
    try {
        const getTeacherSection = await TeacherSectionSubject.findById(idForDetail)
        .populate('teacherId',['first', 'last', 'middle','gender'])
        .populate({
            path:'sectionId', 
            populate:{
                path:'gradeId',
                select:'grade'
            }
        })
        .populate('subjects')
        

        if(getTeacherSection){
            res.status(200).json(getTeacherSection)
        }else{
            res.status(404).json({error:"There is Secction with this id"})
        }
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
    
})

// Route to update an assignment
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { teacherId, sectionId, subjectId, yearId } = req.body;

    try {
        const updatedAssignment = await TeacherSectionSubject.findByIdAndUpdate(id, {
            teacherId,
            sectionId,
            subjectId,
            yearId
        }, { new: true });

        res.status(200).json({ message: 'Assignment updated successfully', updatedAssignment });
    } catch (error) {
        res.status(400).json({ message: 'Error updating assignment', error: error.message });
    }
});

// Route to delete an assignment
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await TeacherSectionSubject.findByIdAndDelete(id);
        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting assignment', error: error.message });
    }
});
/*************************************All in one********************************************/
/**
 * Grade
 * sections in that grade with students
 * subjects in that class with teacher's name of the subject
 */
router.get('/allinone', async (req, res) => {
    try {
        const grades = await Score.aggregate([
            // Step 1: Lookup Students
            {
                $lookup: {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'student'
                }
            },
            { $unwind: '$student' },

            // Step 2: Lookup Sections
            {
                $lookup: {
                    from: 'sections',
                    localField: 'student.sectionId',
                    foreignField: '_id',
                    as: 'section'
                }
            },
            { $unwind: '$section' },

            // Step 3: Lookup Grades
            {
                $lookup: {
                    from: 'grades',
                    localField: 'section.gradeId',
                    foreignField: '_id',
                    as: 'grade'
                }
            },
            { $unwind: '$grade' },

            // Step 4: Lookup Teachers
            {
                $lookup: {
                    from: 'teachers',
                    localField: 'teacherId',
                    foreignField: '_id',
                    as: 'teacher'
                }
            },
            { $unwind: '$teacher' },

            // Step 5: Lookup Subjects
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subjectId',
                    foreignField: '_id',
                    as: 'subject'
                }
            },
            { $unwind: '$subject' },

            // Step 6: Grouping Data by Grade
            {
                $group: {
                    _id: '$grade._id',
                    grade: { $first: '$grade.grade' },
                    sections: {
                        $push: {
                            _id: '$section._id',
                            name: '$section.section',
                            subjects: {
                                $push: {
                                    _id: '$subject._id',
                                    name: '$subject.name',
                                    teacher: {
                                        _id: '$teacher._id',
                                        first: '$teacher.first',
                                        last: '$teacher.last'
                                    }
                                }
                            },
                            students: {
                                $push: {
                                    _id: '$student._id',
                                    first: '$student.first',
                                    middle: '$student.middle',
                                    last: '$student.last',
                                    age: '$student.age',
                                    gender: '$student.gender'
                                }
                            }
                        }
                    }
                }
            },

            // Step 7: Optional Projection
            {
                $project: {
                    _id: 1,
                    grade: 1,
                    sections: 1
                }
            }
        ]);

        // Sending the grouped data as response
        res.status(200).json(grades);
    } catch (error) {
        console.error('Error fetching grades:', error); // Log the error
        res.status(500).json({ error: 'An error occurred while fetching grades.' });
    }
});

module.exports = router;
