const { default: mongoose } = require('mongoose');
const {TeacherSectionSubject} = require('../model/TeacherSectionSubject.model')
const {Teacher} = require('../model/Teacher.model')
const {Section} = require('../model/YearModel')
const {Subject} = require('../model/Subject.model')
const {Year} = require('../model/YearModel')

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
    const { teacherId, newSectionId, newSubjects, yearId } = req.body;

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

/*const AllAssignmentOfTeacher = async (req, res) => {
    const { teacherId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(teacherId)){
        return res.status(401).json({error:"Inalid teacher Id!"})
    }
    try {
        const assignments = await TeacherSectionSubject.find({ teacherId })
            .populate('teacherId')
            .populate('sectionId')
            .populate('subjects')

        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching assignments', error: error.message });
    }
}*/

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
    const { id } = req.params;
    const { teacherId, sectionId, subjectId, yearId } = req.body;

    // Check if the assignment ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid assignment ID!' });
    }

    // Define an object with required IDs for validation
    const requiredIds = { teacherId, sectionId, subjectId, yearId };

    // Check each ID is valid MongoDB ObjectID
    for (const [key, value] of Object.entries(requiredIds)) {
        if (value && !mongoose.Types.ObjectId.isValid(value)) {
            return res.status(400).json({ message: `Invalid ID format for ${key}` });
        }
    }

    try {
        // Validate if the provided IDs exist in their respective collections
        const validateExistence = async (model, id, modelName) => {
            if (id) {
                const exists = await model.findById(id);
                if (!exists) {
                    throw new Error(`${modelName} with ID ${id} not found`);
                }
            }
        };

        // Validate each ID
        await Promise.all([
            validateExistence(Teacher, teacherId, 'Teacher'),
            validateExistence(Section, sectionId, 'Section'),
            validateExistence(Subject, subjectId, 'Subject'),
            validateExistence(Year, yearId, 'Year'),
        ]);

        // Update the assignment with validated IDs
        const updatedAssignment = await TeacherSectionSubject.findByIdAndUpdate(
            id,
            { teacherId, sectionId, subjectId, yearId },
            { new: true, runValidators: true } // Return the updated document and run validations
        );

        if (!updatedAssignment) {
            return res.status(404).json({ message: 'Assignment not found!' });
        }

        res.status(200).json({ message: 'Assignment updated successfully', updatedAssignment });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
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
    //AllAssignmentOfTeacher,
    AllAssignmentOfASection,
    AssignedSectionAndSubjectForATeacher,
    SectionsOfATeacher,
    UpdateAssignment,
    //DeleteAssignment
}