const mongoose =  require("mongoose")

const UserRegisterSchema = mongoose.Schema ({
    username:{type: String,required:true},
    email:{type:String,required:true},
    role:{type:String,required:true},
    password:{type:String,required:true}
})

const RegisterModel = new mongoose.model("User", UserRegisterSchema)