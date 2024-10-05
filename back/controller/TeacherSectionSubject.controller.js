const mongoose = require('mongoose');
const {TeacherSectionSubject} = require('../model/TeacherSectionSubject.model')

const AssignAteacherForSubject = async (req, res) => {
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
}
//Re  ssign a teacher for subjects
const ReAssignTeacherForSubject = async (req, res) => {
    const { teacherId,newSectionId, newSubjects, yearId } = req.body;

    if(!req.userId) return res.status(401).json({error:"Un Autherized"});

    try {
        // End the teacher's current assignments
        await TeacherSectionSubject.updateMany(
            { teacherId, endDate: { $exists: false } },
            { endDate: new Date() }
        );

        // Create a new assignment
        const newAssignment = new TeacherSectionSubject({
            teacherId,
            sectionId: newSectionId,
            subjects: newSubjects,
            yearId,
            startDate: new Date()
        });

        await newAssignment.save();

        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const AllAssignmentOfTeacher = async (req, res) => {
    const { teacherId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(teacherId)){
        return res.status(401).json({error:"Inalid teacher Id!"})
    }
    try {
        const assignments = await TeacherSectionSubject.find({ teacherId })
            .populate('teacherId')
            .populate({
                path:'sectionId',
                populate:{
                    path:'gradeId',
                    select:'grade'
                }
            })
            .populate('subjects')

        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({error: error.message });
    }
}

const GroupedByGrade = async (req, res) => {
    const { teacherId } = req.params;

    // Validate the teacher ID
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ error: "Invalid teacher ID!" });
    }

    try {
        // Fetch assignments for the specified teacher
        const assignments = await TeacherSectionSubject.find({ teacherId })
            .populate('teacherId')
            .populate({
                path: 'sectionId',
                populate: {
                    path: 'gradeId',
                    select: 'grade'
                }
            })
            .populate('subjects');

        // Check if assignments exist
        if (!assignments.length) {
            return res.status(404).json({ error: "No assignments found for this teacher." });
        }

        // Group assignments by grade
        const groupedByGrade = assignments.reduce((acc, assignment) => {
            const grade = assignment.sectionId.gradeId.grade; // Extract the grade

            // Initialize group by grade if not present
            if (!acc[grade]) {
                acc[grade] = {
                    grade: grade,
                    sections: []
                };
            }

            // Find the section in the current grade group
            const sectionIndex = acc[grade].sections.findIndex(
                sec => sec.section._id === assignment.sectionId._id
            );

            // If section is not found, add it with an empty subjects array
            if (sectionIndex === -1) {
                acc[grade].sections.push({
                    section: assignment.sectionId,
                    subjects: [...assignment.subjects] // Start with the first subject
                });
            } else {
                // If the section already exists, add the subjects
                acc[grade].sections[sectionIndex].subjects.push(...assignment.subjects);
            }

            return acc;
        }, {});

        // Convert grouped object into an array for response
        const structuredData = Object.values(groupedByGrade);
        
        // Send the structured data as a response
        res.status(200).json(structuredData);
    } catch (error) {
        // Handle any errors and return a 500 status code with the error message
        res.status(500).json({ error: error.message });
    }
};

//get all assignment of a section
const AllAssignmentOfASection = async (req, res) => {
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
}

const SectionsOfATeacher = async(req,res)=>{
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
}

//get Assign sections and subjects for a teacher by using that id
const AssignedSectionAndSubjectForATeacher = async(req,res)=>{
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
            res.status(404).json({error:"There is no Secction with this id"})
        }
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }   
}
//update assignment
const UpdateAssignment = async (req, res) => {
    const { teacherId, sectionId, oldSubjectId, newSubjectId, yearId } = req.body;

    try {
        // Validate ObjectIds
        const ids = [teacherId, sectionId, oldSubjectId, newSubjectId, yearId];
        ids.forEach(id => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: `Invalid ID: ${id}` });
            }
        });

        // Find the assignment by teacherId, sectionId, and yearId
        const assigned = await TeacherSectionSubject.findOne({ teacherId, sectionId });
        if (!assigned) return res.status(404).json({ error: 'Assignment not found.' });

        // Check if old subject exists in the subjects array
        const subjectIndex = assigned.subjects.findIndex(sub => sub.toString() === oldSubjectId);
        if (subjectIndex === -1) {
            return res.status(404).json({ error: 'Old subject not found in assignment.' });
        }

        // Replace old subject with the new subject
        assigned.subjects[subjectIndex] = newSubjectId;

        // Save the updated assignment
        await assigned.save();

        res.json({ message: 'Subject assignment updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { UpdateAssignment };

//delete an assignment

/*const DeleteAssignment = async (req, res) => {
    const { id } = req.params;

    // Validate if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid assignment ID format!' });
    }

    try {
        const deletedAssignment = await TeacherSectionSubject.findByIdAndDelete(id);

        // Check if the assignment was found and deleted
        if (!deletedAssignment) {
            return res.status(404).json({ message: 'Assignment not found!' });
        }

        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assignment', error: error.message });
    }
}
*/
module.exports = {
    AssignAteacherForSubject,
    ReAssignTeacherForSubject,
    AllAssignmentOfTeacher,
    AllAssignmentOfASection,
    AssignedSectionAndSubjectForATeacher,
    SectionsOfATeacher,
    UpdateAssignment,
    GroupedByGrade
    //DeleteAssignment
}