const router = require('express').Router()
const { default: mongoose } = require('mongoose');
const {SectionTeacher} = require('../model/medium')

router.get('/teacher/section/:teacherId', async (req, res) => {
    const { teacherId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(teacherId)){
        return res.status(400).json({error:"Invalid Id"})
    }

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
            return res.status(200).json(teacherSections);
        } else {
            res.status(404).json({ error: 'No sections found for this teacher!' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/add-sections-subjects/${teacherId}',async(req,res)=>{
    const { teacherId } = req.params;
    const { sections } = req.body;

    try {
        // Find the teacher's existing record in SectionTeacher
        let sectionTeacher = await SectionTeacher.findOne({ teacherId });

        if (!sectionTeacher) {
            // If no record exists for the teacher, create a new one
            sectionTeacher = new SectionTeacher({
                teacherId,
                sections: []
            });
        }

        // Add the new sections and subjects to the teacher's record
        sections.forEach(({ sectionId, subjectIds }) => {
            const existingSection = sectionTeacher.sections.find(sec => sec.sectionId.toString() === sectionId);
            if (existingSection) {
                // If the section already exists, update its subjects
                existingSection.subjectIds = [...new Set([...existingSection.subjectIds, ...subjectIds])];
            } else {
                // If the section doesn't exist, add a new section entry
                sectionTeacher.sections.push({ sectionId, subjectIds });
            }
        });

        // Save the updated SectionTeacher record
        await sectionTeacher.save();

        res.status(200).json({ message: 'Sections and subjects added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add sections and subjects' });
    }
})
module.exports = router