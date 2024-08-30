const { default: mongoose } = require('mongoose')
const { Score } = require('../model/ScoreModel')

const router = require('express').Router()

//creating score
router.get('/subject/:subjectId',async(req,res)=>{
    const {subjectId} = req.params

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        res.status(400).json({error:"Invalid Id"})
    }

    try {
        const subject = await Score.find({subjectId})
        if(subject.length == 0){
            res.status(404).json({error:"Not Found"})
        }else{
            res.status(200).json(subject)
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }

})

module.exports = router