const router = require('express').Router()
const {Grade,Year,Section} = require('../model/YearModel')

//create year and with that year grade

router.post('/create-year', async (req, res) => {
    const yearData = req.body;
    try {
        const existingYear = await Year.findOne({ yearName: yearData.yearName });

        if (!existingYear) {
            // Create the year
            const year = await Year.create(yearData);

            // Create grades for the year
            const grades = Array.from({ length: 8 }, (_, i) => ({
                grade: i + 1,
                yearId: year._id
            }));

            const createdGrades = await Grade.insertMany(grades);

            // Create sections for each grade
            const sectionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
            const sections = createdGrades.flatMap(grade =>
                sectionLabels.map(label => ({
                    section: label,
                    gradeId: grade._id
                }))
            );

            await Section.insertMany(sections);

            res.status(201).json({ message: 'Year, grades, and sections inserted successfully.' });
        } else {
            res.status(409).json({ error: 'Year already exists. No new grades or sections were inserted.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//get grade

router.get('/grades',async(req,res)=>{
    const getGrade = await Grade.find({})
    if(getGrade){
        return res.status(200).json({getGrade})
    }else{
        return res.status(404).json({error:"Not found"})
    }

})

// Route to get sections for a specific grade
router.get('/grades/:gradeId/sections', async (req, res) => {
    const { gradeId } = req.params;

    try {
        const sections = await Section.find({ gradeId: gradeId });

        if (sections.length > 0) {
            res.status(200).json(sections);
        } else {
            res.status(404).json({ error: 'No sections found for this grade.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// check is the year exist or not

router.get('/check-academic-year', async (req, res) => {
    try {
        const yearExists = await Year.exists({});
        res.json({ yearExists }); // its reasult will be true or false
    } catch (error) {
        res.status(400).json({ error: "Not found" });
    }
});

module.exports = router