const router = require('express').Router()
const {Teacher} = require('../../model/TeacherIssues/Teacher')

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
            { teacherId, endDate: { $exists: false } }, // Only update current assignments
            { endDate: new Date() }
        );

        res.status(200).json({ message: 'Teacher marked as inactive and assignments updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router