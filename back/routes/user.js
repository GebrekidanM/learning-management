const router = require('express').Router()
const User = require('../model/userModel')

router.get('/', async(req,res)=>{
    const user = User.find({})
})

module.exports = router