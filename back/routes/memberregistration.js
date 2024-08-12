const router = require('express').Router()
const mongoose = require('mongoose')
const {Student} = require('../model/userModel')

router.post('/', async (req,res)=>{
    const {first,middle,last,gender,age,region,city,subCity,wereda,houseNo,familyTel,sectionId} = req.body

    try {
        const createStudent = await Student.create({first,middle,last,gender,age,sectionId,region,city,subCity,wereda,houseNo,familyTel})
        if (createStudent) {
            return res.status(200).json({createStudent})
        } else {
           return res.status(500).json({error:"Something is wrong, please try later!"})
        }
    } catch (error) {
        return res.status(500).json({error:error.massage})
    }
})


//get one student
router.get('/:id',async(req,res)=>{
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

module.exports = router