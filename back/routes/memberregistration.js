const router = require('express').Router()
const mongoose = require('mongoose')
const upload = require('../upload') 
const {Student, Family, Teacher} = require('../model/userModel')
const {Section,Grade, Year} = require('../model/YearModel')
const { populate } = require('dotenv')

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

//get one student without additional information

router.get('/student/only/:id',async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:"Not valid id!"})
    }
    try {
        const student = await Student.findById(id)
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

router.get('/students/:sectionId',async(req,res)=>{
    const {sectionId} = req.params
    try {
        const students = await Student.find({sectionId});
        if(students == ""){
           return res.status(404).json({error:"There is no student in this class"})
        }
        res.status(200).json(students);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

/**********************************For teacher**************************************/

router.post('/teacher', upload.single('teacherPhoto'), async (req, res) => {
    const {first, middle, last, gender, age, region, city, subCity, wereda, houseNo, yearId , experience, email, phoneNo} = req.body;
    const teacherPhoto = req.file.filename
    try {
        const student = await Teacher.create({first, middle, last, gender, age, region, city, subCity, wereda, houseNo, yearId , experience, email, phoneNo,teacherPhoto})
        if(student){
            res.status(200).json(student)
        }else{
            res.status(400).json({error:"Something is wrong!"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error.message})
    }
});

//get teacher by id

router.get('/teacher/:teacherId',async(req,res)=>{
    const {teacherId} = req.params
    if(!mongoose.Types.ObjectId.isValid(teacherId)){
        return res.status(404).json({error:"Invalid Id!"})
    }
    try {
        const teacher = await Teacher.findById({_id:teacherId}).populate('yearId')
        if(!teacher){
            return res.status(404).json({error:"a Teacher with this id isnot found!"})
        }
        res.status(200).json(teacher)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


//get all teachers

router.get('/teachers', async (req, res) => {
    try {
        // Get today's date
        const today = new Date();

        // Find the current year based on today's date
        const currentYear = await Year.findOne({
            startPoint: { $lte: today },
            endPoint: { $gte: today }
        });

        if (!currentYear) {
            return res.status(404).json({ error: "No active year found for today's date." });
        }

        // Filter teachers by the current yearId
        const teachers = await Teacher.find({ yearId: currentYear._id })
        if(teachers){
            // Respond with the filtered list of teachers
            res.status(200).json(teachers);
        }else{
            res.status(404).json({error:error.message})
        }
        
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: error.message });
    }
});

//update student information

router.patch('/student/update/:studentId', upload.single('studentPhoto'), async (req, res) => {
    const { studentId } = req.params;
    const updates = req.body;

    // Check if the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(404).json({ error: 'Invalid ID!' });
    }
    if (req.file) {
        updates.studentPhoto = req.file.filename; 
    }

    try {
        const updatedStudent = await Student.findByIdAndUpdate(studentId, updates, { new: true, runValidators: true });
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found!' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**************************** For Student Family ********************************************/
//get family with student id
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

/// get family with family id
router.get('/family/own/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const family = await Family.find({_id:id}).populate({
            path:'studentId',
            select:'-studentPhoto -createdAt -updatedAt -gender -age -_id -last'
        })
        if(!family){
            return res.status(404).json({error:"Not found!"})
        }
        res.status(200).json(family)
    } catch (error) {
        res.status(500).json({error:"Server error"})
    }
})

/// get family with family id
router.get('/family/only/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const family = await Family.find({_id:id})
        if(!family){
            return res.status(404).json({error:"Not found!"})
        }
        res.status(200).json(family)
    } catch (error) {
        res.status(500).json({error:"Server error"})
    }
})

//register family
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

//get all families
router.get('/families',async(req,res)=>{

    try {
        const family = await Family.find({}).populate({
            path: 'studentId',
            select: 'first middle sectionId',
            populate:({
                path:'sectionId',
                populate:({
                    path:'gradeId',
                    select:'grade'
                })
            })
        });
        if(!family){
            return res.status(404).json({error:"Not found!"})
        }
        res.status(200).json(family)
    } catch (error) {
        res.status(500).json({error:"Server error"})
    }
})

//update family information

router.patch('/family/update/:familyId', upload.single('familyPhoto'), async (req, res) => {
    const { familyId } = req.params;
    const updates = req.body;

    // Check if the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(familyId)) {
        return res.status(404).json({ error: 'Invalid ID!' });
    }
    if (req.file) {
        updates.familyPhoto = req.file.filename;
    }

    try {
        const updatedFamily = await Family.findByIdAndUpdate(familyId, updates, { new: true, runValidators: true });
        if (!updatedFamily) {
            return res.status(404).json({ error: 'Family not found!' });
        }
        res.status(200).json(updatedFamily);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID!' });
    }

    try {
        // Try to delete from Family
        const deletedFamily = await Family.findByIdAndDelete(id);
        if (deletedFamily) {
            return res.status(200).json(deletedFamily);
        }

        // Try to delete from Student if Family not found
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (deletedStudent) {
            return res.status(200).json(deletedStudent);
        }

        // Try to delete from Teacher if Student not found
        const deletedTeacher = await Teacher.findByIdAndDelete(id);
        if (deletedTeacher) {
            return res.status(200).json(deletedTeacher);
        }

        // If none were deleted
        return res.status(404).json({ error: "No document found with this ID!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router