const mongoose =  require("mongoose")

const AdminSchema = new mongoose.Schema ({
    username:{type: String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    role:{type:Number,enum:[1,2],default:2,required:true},//1 for writer 2 director
    password:{type:String,required:true}
})

const Admin = new mongoose.model("User", AdminSchema)

const TeacherSchema = new mongoose.Schema({})

module.exports = {Admin}