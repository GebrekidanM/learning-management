const express = require('express');
const router = express.Router();
const { TeacherSectionSubject } = require('../model/medium');

// Route to assign a subject to a teacher for a specific section
router.post('/assign', async (req, res) => {
    const { teacherId, sectionId, subjectId, yearId } = req.body;

    try {
        const assignment = new TeacherSectionSubject({
            teacherId,
            sectionId,
            subjectId,
            yearId
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
            .populate('subjectId')
            .populate('yearId');

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
            .populate('yearId');

        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching assignments', error: error.message });
    }
});

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
