const mongoose =  require("mongoose")

const AdminSchema = new mongoose.Schema ({
    username:{type: String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    role:{type:Number,enum:[1,2],default:2,required:true},//1 for writer 2 director
    password:{type:String,required:true}
})

const Admin = mongoose.model("User", AdminSchema)

const TeacherSchema = new mongoose.Schema({})

const StudentSchema = new mongoose.Schema({
    first:{type:String,required:true},
        middle:{type:String,required:true},
        last:{type:String,required:true},
        gender:{type:String,required:true},
        age:{type:Number,required:true},
        sectionId:{type:mongoose.Schema.Types.ObjectId, ref:'SectionModel',required:true},
        region:{type:String,required:true},
        city:{type:String,required:true},
        subCity:{type:String,required:true},
        wereda:{type:String,required:true},
        houseNo:{type:Number,required:true},
        familyTel:{type:Number,required:true}
},
{ timestamps: true } 
)
const Student = mongoose.model('Student',StudentSchema)

module.exports = {Admin,Student}