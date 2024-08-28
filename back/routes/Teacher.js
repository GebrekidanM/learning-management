const router = require('express').Router()
const {Teacher} = require('../model/Teacher')


// it is for leaving teacher
router.post('/leave', async (req, res) => {
    const { teacherId } = req.body;

    try {
        // Mark the teacher as inactive
        const teacher = await Teacher.findByIdAndUpdate(teacherId, { isActive: false }, { new: true });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Update all their assignments by setting an endDate
        await TeacherSectionSubject.updateMany(
            { teacherId, endDate: { $exists: false } }, // looking for the same teacherId and endDate:null or endDate:false in teahersectionsubject 
            { endDate: new Date() }
        );

        res.status(200).json({ message: 'Teacher marked as inactive and assignments updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/*When a teacher changes their class or subject, we will:
    1. End their current assignment by setting an endDate.
    2. Create a new TeacherSectionSubject record with the new class/subject information.*/

router.post('/change-assignment', async (req, res) => {
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
});


module.exports = router