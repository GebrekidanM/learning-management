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

//get semester
router.get('/semester/:yearId', async(req,res)=>{
    try {
        const {yearId} = req.params
        if(!mongoose.Types.ObjectId.isValid(yearId)){
            res.status(400).json({error:"Year Id is invalid!"})
        }
        const semester = await Semester.find({yearId}).sort({createdAt:-1}).limit(1)

        if (semester.length === 0) {
            return res.status(404).json({ error: "No semesters found for the provided Year ID." });
        }

        // Send the found semester
        res.status(200).json(semester[0]);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

//get grades
router.get('/grades/:semesterId',async(req,res)=>{
    try {
        const {semesterId} = req.params
        const grades = await Grade.find({semesterId})

        if(grades){
            res.status(200).json(grades)
        }else{
            res.status(404).json({error:"No grade"})
        }
    } catch (error) {
        res.status(500).json({error:error.massege})
    }
})
//creating grade
router.post('/create/grade', async(req,res)=>{
    const {yearId,semesterId,grade} = req.body

    // Check for missing required fields
    if (!yearId || !semesterId || !grade) {
        return res.status(400).json({ error: 'Year ID, Semester ID, and Grade are required!' });
    }
   
    try {
        const getGrade = await Grade.findOne({grade,semesterId,yearId})

        if(getGrade){
            return res.status(400).json({error:"A grade is found in this Year and semester!"})
        }

        const createdGrade = await Grade.create({yearId,semesterId,grade})
        
        if(createdGrade){
            res.status(202).json(createdGrade)
        }else{
            res.status(400).json({error:'Something is wrong, please try again'})
        }

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const error = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error });
        }
        
        res.status(500).json({ error: error.message });
    }
})
//Delete grade
router.delete('/grade/delete/:id', async(req,res)=>{
    const {id} = req.params
    try {
        const deletedGrade = await Grade.findByIdAndDelete(id)

        if(!deletedGrade){
           return res.status(404).json({error:"No grade with this Id!"})
        }

        await Section.deleteMany({gradeId:id})
        res.status(200).json("Successfully Deleted")

    } catch (error) {
        res.status(500).json({error:error.message})
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

//create sections

router.post('/create/sections',async(req,res)=>{
    const {section,gradeId} = req.body
    try {
            for(const sec of section ){
                const getSection = await Section.findOne({section:sec,gradeId})
                
                if(getSection){
                    return res.status(400).json({error: "The Section is already exist!"})
                 }
            }
                 const CreatedSections = await Section.insertMany(section.map(sec=>({section:sec,gradeId})))
           
                 res.status(200).json(CreatedSections)
        
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const error = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error });
        }
        
        res.status(500).json({ error: error.message });
    }
})

// get sections
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