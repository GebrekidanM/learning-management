const router = require('express').Router()
const {SectionTeacher} = require('../model/medium')

router.get('/teacher/section/:teacherId', async (req, res) => {
    const { teacherId } = req.params;

    try {
        const teacherSections = await SectionTeacher.findOne({ teacherId }).populate({
            path: 'sections.sectionId', // Populate sectionId within sections array
            populate: {
                path: 'gradeId', // Further populate the gradeId within the section
            },
        }).populate({
            path: 'sections.subjectIds', // Populate the subjectIds within sections array
        });

        if (teacherSections) {
            res.status(200).json(teacherSections);
        } else {
            res.status(404).json({ error: 'No sections found for this teacher!' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router