const express = require('express');
const router = express.Router();
const { TeacherSectionSubject } = require('../model/medium');
const { default: mongoose } = require('mongoose');

// Route to assign a subject to a teacher for a specific section
router.post('/assign', async (req, res) => {
    const { teacherId, sectionId, subjects } = req.body;

    try {
        const assignment = new TeacherSectionSubject({
            teacherId,
            sectionId,
            subjects
        });

        await assignment.save();
        res.status(201).json({ message: 'Subject assigned to teacher successfully!', assignment });
    } catch (error) {
        res.status(400).json({ message: 'Error assigning subject', error: error.message });
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

module.exports = router;
