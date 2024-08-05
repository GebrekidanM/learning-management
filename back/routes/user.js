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

    const newUser = new Admin({ username, email, password: hashedPassword ,role});
    await newUser.save();
} catch (error) {
    res.status(500).json({error: "Server error, please try again!"})
}
    
})

module.exports = router