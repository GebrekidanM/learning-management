const router = require('express').Router()
const mongoose = require('mongoose')
const upload = require('../upload') 
const {Student, Family} = require('../model/userModel')
const {Section,Grade} = require('../model/YearModel')

// Route to handle student creation
router.post('/student', upload.single('studentPhoto'), async (req, res) => {
    const {first, middle, last, gender, age, region, city, subCity, wereda, houseNo, sectionId } = req.body;
    const studentPhoto = req.file.filename
    try {
        const student = await Student.create({first, middle, last, gender, age, region, city, subCity, wereda, houseNo, sectionId,studentPhoto})
        if(student){
            res.status(200).json(student)
        }else{
            res.status(400).json({error:"Something is wrong!"})
        }
    } catch (error) {
        res.status(500).json({error:"Server error"})
    }
});

//get one student
router.get('/student/:id',async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:"Not valid id!"})
    }
    try {
        const student = await Student.findById(id).populate({
            path: 'sectionId',
            populate: {
                path: 'gradeId',
                populate: {
                    path: 'yearId'
                }
            }
        });
        if(Student){
            res.status(200).json({student})
        }else{
            res.status(404).json({error:"No student!"})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

//get all students
router.get('/',async(req,res)=>{
    try {
        const students = await Student.find({}).populate('sectionId')
        if(students){
            res.status(200).json({students})
        }else{
            res.status(400).json({eroor:"Not found!"})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


//get student by sectionId

router.get('/student/:sectionId',async(re,res)=>{
    const {sectionId} = req.params
    
})

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


/**************************** For Student Family ********************************************/
router.get('/family/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const family = await Family.find({studentId:id})
        if(!family){
            return res.status(404).json({error:"Not found!"})
        }
        res.status(200).json({family})
    } catch (error) {
        res.status(500).json({error:"Server error"})
    }
})

router.post('/family', upload.single('familyPhoto'), async(req,res)=>{
    const {familyFirst,familyLast,familyMiddle,familyType,familyEmail,familyPhone,studentId} = req.body
    const familyPhoto = req.file.filename
    try {
        const family = await Family.create({familyFirst,familyLast,familyMiddle,familyType,familyEmail,familyPhone,familyPhoto,studentId})
        if(!family){
            return res.status(400).json({error:"Something is wrong please try again"})
        }
        res.status(200).json(family)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error.message})
    }
})

module.exports = router