const router = require('express').Router()
const { Admin } = require('../model/userModel')
const bcrypt = require("bcrypt")
//get all users
router.get('/', async(req,res)=>{

})

//create one new user only for the first time
router.get('/create',async (req,res)=>{
    const username = 'user'
    const password = 'User@001'
    const email = 'user@gmail.com'
    const role = 2
try {
    const user = await Admin.find({})


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if(user)return;

    const newUser = await Admin.save({ username, email, password: hashedPassword ,role});
    res.status(200).json(newUser)

} catch (error) {
    res.status(500).json({error: "Server error, please try again!"})
}
    
})

router.post('/',async(req,res)=>{
    const {username,password} = req.body
try {
    const getUser = await Admin.findOne({username})
} catch (error) {
    
}
    
})

module.exports = router