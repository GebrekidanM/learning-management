const router = require('express').Router()
const mongoose = require('mongoose')
const {Grade,Year,Section} = require('../model/YearModel');
const { Subject } = require('../model/SubjectModel');
const {Student} = require('../model/userModel')
//create year and with that year grade
const subjects = ["አማርኛ","ሒሳብ","አካባቢ ሳይንስ","የክወና እና እይታ ጥበብ","የሥነ ጥበባት ትምህርት","ጤሰማ","ስነ ምግባር","ኅብረተሰብ","English","Affan Oromo","Spoken","Grammer","Communication","Mathematics","General Science","Social Study","PVA","HPE"]

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

           const section = await Section.insertMany(sections);
           if(section) {
            const subject = section.flatMap(sec=>(
                subjects.map(sub=>({
                    name:sub,
                    sectionId:sec._id
                }))
            ))
                await Subject.insertMany(subject)
           };

            res.status(201).json({ message: 'Year, grades, and sections inserted successfully.' });
        } else {
            res.status(409).json({ error: 'Year already exists. No new grades or sections were inserted.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//get grade
/**********************************************For grades and sections************************************************ */
//get grades with students 

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