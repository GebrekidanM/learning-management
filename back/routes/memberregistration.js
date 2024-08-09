const router = require('express').Router()
const {Student} = require('../model/userModel')

router.post('/', async (req,res)=>{
    const {first,middle,last,gender,age,grade,region,city,subCity,wereda,houseNo,familyTel} = req.body

    try {
        const createStudent = await Student.create({first,middle,last,gender,age,grade,region,city,subCity,wereda,houseNo,familyTel})
        if (createStudent) {
            return res.status(200).json({createStudent})
        } else {
           return res.status(500).json({error:"Something is wrong, please try later!"})
        }
    } catch (error) {
        return res.status(500).json({error:error.massage})
    }
})



module.exports = router