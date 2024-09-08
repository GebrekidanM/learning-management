const router = require('express').Router()
const { default: mongoose } = require('mongoose');
const { Subject } = require('../model/SubjectModel');

// geting subjects in one section
router.get('/subjects/:sectionId', async(req,res)=>{
    const {sectionId} = req.params
    if(!mongoose.Types.ObjectId.isValid(sectionId)) return res.status(400).json({error:`${sectionId} is not valid Id!`});

    try {
        const getSubject = await Subject.find({sectionId})
        if(getSubject.length>0){
            res.status(200).json(getSubject)
        }else{
            res.status(404).json({error: 'No subject by this id!'})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post('/create',async(req,res)=>{
    const {sectionId,name} = req.body
})

module.exports = router