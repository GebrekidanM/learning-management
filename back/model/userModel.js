const mongoose =  require("mongoose")

const UserRegisterSchema = new mongoose.Schema ({
    username:{type: String,required:true},
    email:{type:String,required:true},
    role:{type:String,required:true},
    password:{type:String,required:true}
})

const RegisterModel = new mongoose.model("User", UserRegisterSchema)

const TeacherSchema = new mongoose.Schema({})

module.exports = {RegisterModel}