const {Admin} = require('../model/user.model')
const bcrypt = require("bcrypt")
const crypto = require('crypto')
const generateId = require('../utilities/GenerateAdminId')
const { default: mongoose } = require('mongoose')

//to create user at the first time automatically
const createForOneTimeUser = async (req,res)=>{
    const username = 'user'
    const middle='middle'
    const last='last'
    const phoneNo = '0918786767'
    const password = 'User@001'
    const email = 'user@gmail.com'
    const role = 'Admin'
    const userId = generateId('Admin')
    const gender='Male';
    const age = 35;
    const region="Addis Ababa"
    const city ="Addis Ababa"
    const subCity = "Arada"
    const wereda = "09"
    const houseNo = "1587"
    try {
        const user = await Admin.findOne({})
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        if(user)return res.status(400).json({error:'There is a user'});

        const newUser = await Admin.create({userId, gender,age,region,city,subCity,wereda,houseNo,username, email, password: hashedPassword ,role,middle,last,phoneNo});
        if(newUser){
            res.status(200).json(newUser)
        }else{
            return res.status(500).json({error:"Something is wrong!"})
        }   
    } catch (error) {
        console.log(error)
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: validationErrors });
        }
        res.status(500).json({ error: error.message });
    } 
}

//to reset password

const forgotPassword = async (req,res) =>{
    const {email} = req.body;
    try {
        const user = await Admin.findOne({email})

        if(!user){
            return res.status(400).json({error:'This user is not exist'})
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpireAt = Date.now() + 1*60*60*1000;
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpireAt = resetTokenExpireAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `http://localhost:3000/reset-password/${resetToken}`)
        res.status(200).json('Password reset link sent successfully. Please check your email.');
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request. Please try again later.' });
    }
}

module.exports = {
                createForOneTimeUser,
                forgotPassword
            }