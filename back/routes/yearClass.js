const router = require('express').Router()
const mongoose = require('mongoose')
const {Grade,Year,Section,Semester} = require('../model/YearModel');
const { Subject } = require('../model/SubjectModel');
const {Student} = require('../model/userModel')

//create year and with that year grade
router.post('/create-year', async (req, res) => {
    const yearData = req.body;

    try {
        const existingYear = await Year.findOne({ yearName: yearData.yearName });

        if (!existingYear) {
            // Create the year
            const year = await Year.create(yearData);

            res.status(201).json(year);
        } else {
            res.status(409).json({ error: 'Year already exists. No new grades, sections, or semesters were inserted.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/semester/create', async(req,res)=>{
    const { name, startDate, endDate,yearId } = req.body; // Assuming semester data is included in the request body

    try {
        const semester = {
            name: name, // Default to 'Semester 1' if not provided
            startDate: startDate,
            endDate: endDate,
            yearId: yearId, // Associate the semester with the year
        };

        const createdSemester = await Semester.create(semester);

        const grade = {
            grade: 1, // Adjust the grade level as needed
            yearId: yearId,
            semesterId:createdSemester._id,
        };

        const createdGrade = await Grade.create(grade);

        // Create one section for the created grade
        const section = {
            section: 'A', // Adjust the section label as needed
            gradeId: createdGrade._id
        };

        const createdSection = await Section.create(section);

        const subjects = ['Math', 'English']; // Adjust the subjects as needed

        // Create subjects for the created section
        const subjectData = subjects.map(sub => ({
            name: sub,
            sectionId: createdSection._id
        }));

        await Subject.insertMany(subjectData);

        res.status(200).json(createdSemester)

    } catch (error) {
        res.status(500).json({error:error.message})
        
    }
})

/**********************************************For grades and sections************************************************ */
//get semesters
router.get('/semesters', async(req,res)=>{
    try {
        const semesters = await Semester.find({})
        if(semesters){
            res.status(200).json(semesters)
        }else{
            res.status(404).json({error:"No semester at all!"})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

//get grades
router.get('/grades/:semesterId',async(req,res)=>{
    try {
        const grades = await Grade.find({}).populate('yearId')

        if(grades){
            res.status(200).json(grades)
        }else{
            res.status(404).json({error:"No grade"})
        }
    } catch (error) {
        res.status(500).json({error:error.massege})
    }
})


//get grades
router.get('/grades',async(req,res)=>{
    try {
        const grades = await Grade.find({}).populate('yearId')

        if(grades){
            res.status(200).json(grades)
        }else{
            res.status(404).json({error:"No grade"})
        }
    } catch (error) {
        res.status(500).json({error:error.massege})
    }
})

router.get('/sections/:gradeId', async (req, res) => {
    const {gradeId} = req.params
    if(!mongoose.Types.ObjectId.isValid(gradeId)){
        return res.status(400).json({error:"Invalid Id!"})
    }
    try {
        const sections = await Section.find({ gradeId });
        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Route to get sections for a specific grade
router.get('/grades/:gradeId/sections', async (req, res) => {
    const { gradeId } = req.params;

    try {
        const sections = await Section.find({ gradeId });

        if (sections.length > 0) {
            res.status(200).json(sections);
        } else {
            res.status(404).json({ error: 'No sections found for this grade.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/sections', async(req,res)=>{
    try {
        const sections = await Section.find({}).populate('gradeId')
        if (sections){
            res.status(200).json(sections)
        }else{
            res.status(404).json({error:"No section!"})
        }
    } catch (error) {
        res.status(500).json({error:"Server error"})
    }
})

// check is the year exist or not

router.get('/check-academic-year', async (req, res) => {
    try {
        const yearExists = await Year.exists({});
        if(yearExists){
            res.status(200).json(yearExists._id);
        }else{
            res.status(404).json({ error: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ error: "Something is wrong" });

    }
});




//get subjects by using sectionId

router.get('/subjects/:sectionId',async(req,res)=>{
    const {sectionId} = req.params
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return res.status(400).json({ error: "Invalid section ID" });
    }

    try {
        // Find subjects by sectionId
        const subjects = await Subject.find({ sectionId });

        // Check if subjects were found
        if (subjects.length > 0) {
            res.status(200).json(subjects); // Success response with 200 OK
        } else {
            res.status(404).json({ error: "No subjects found for this section" }); // 404 Not Found if no subjects
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle any server errors
    }
})
//get all students result with 
router.get('/subject/:subjectId',async(req,res)=>{
    const {subjectId} = req.params
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return res.status(400).json({ error: "Invalid subject ID" });
    }

    try {
        const subject = await Subject.findById(subjectId).populate({
            path:'sectionId',
            populate:{path:'gradeId'}
        })
        if(subject){
            const students = await Student.find({sectionId:subject.sectionId._id.toString()}).select('first last middle age gender');
            res.status(200).json({subject,students})
        }else{
            res.status(404).json({error:"Subject with Id is not found"})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


module.exports = router