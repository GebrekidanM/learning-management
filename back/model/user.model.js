const mongoose =  require("mongoose")

const AdminSchema = new mongoose.Schema ({
    userId:{
        type:String,
        required:[true,'userId is required'],
        trim:true,minlength:[7, 'Its length must seven'],
        unique:[true,'UserId must be unique, try again']},
    username:{type: String,required:true},
    email:{type:String,required:true,unique:true},
    role:{type:String,enum:['Editor','Admin'],default:'Admin',required:true},
    password:{type:String,required:true}
})

AdminSchema.index({userId:1,email:1})
const Admin = mongoose.model("User", AdminSchema)

module.exports = {Admin}