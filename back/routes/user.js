const router = require('express').Router()
const { Admin } = require('../model/userModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

// secretkey for jwt
const secretKey= 'Samra@Kidam-07,16{$}{$}'

//create one new user only for the first time
router.get('/createOne',async (req,res)=>{
    const username = 'user'
    const password = 'User@001'
    const email = 'user@gmail.com'
    const role = 2
    try {
        const user = await Admin.findOne({})
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        if(user)return res.status(400).json({error:'There is a user'});

        const newUser = await Admin.create({ username, email, password: hashedPassword ,role});
        if(newUser){
            res.status(200).json(newUser)
        }else{
            return res.status(500).json({error:"Something is wrong!"})
        }   
    } catch (error) {
        res.status(500).json({error: "Server error, please try again!"})
    }
    
})

//login code

router.post('/', async (req,res) => {
    const {username,password} = req.body

try {
    const getUser = await Admin.findOne({username})
    if(!getUser) {
        return res.status(404).json({error:"This user doesnot found"})
    }

    if(!bcrypt.compare(password,getUser.password)){
        return res.status(400).json({error:"incorrect password!"})
    }
    // information of the user to transfer it through jwt
    const user = {
        username: username,
        role: getUser.role,
        email: getUser.email
    }

    //initiate jwt
    jwt.sign(user,secretKey,{expiresIn:'3d'},(error,info)=>{
        if(error){
            return res.status(400).json({error:"Something is wrong, please try again!"})
        }
        res.cookie('user',info).json({username})
    })
} catch (error) {
    res.status(500).json({error:"Something is wrong, please try again!"})
}
    
})

//to get information of logged user

router.get('/profile', (req,res)=>{
    const {user} = req.cookies
    try {
        if(user){
            jwt.verify(user, secretKey, {expiresIn:'3d'}, (error, info) => {
                if(error) {
                    return res.status(400).json({error:"Something is wrong, please try again!"})
                } else {
                    res.status(200).json(info)
                }
            })
        }        
    } catch (error) {
        res.status({error: error.message})
    }  
})

// for logout
router.get("/logout", (req, res) => {
    res.cookie("user", "").json("ok")
})


module.exports = router