const mongoose =  require("mongoose")

const AdminSchema = new mongoose.Schema ({
    username:{type: String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    role:{type:Number,enum:[1,2],default:2,required:true},//1 for writer 2 director
    password:{type:String,required:true}
})

const Admin = mongoose.model("User", AdminSchema)

const TeacherSchema = new mongoose.Schema({
    first:{type:String,required:true},
    middle:{type:String,required:true},
    last:{type:String,required:true},
    gender:{type:String,required:true},
    age:{type:Number,required:true},
    region:{type:String,required:true},
    city:{type:String,required:true},
    subCity:{type:String,required:true},
    wereda:{type:String,required:true},
    houseNo:{type:Number,required:true},
    teacherPhoto:{type:String,required:true},
    experience:{type:Number,required:true},
    email:{type:String,required:true},
    phoneNo:{type:String,required:true},
    yearId:{type:mongoose.Schema.Types.ObjectId, ref:'Year',required:true}
})
const Teacher = mongoose.model('Teacher',TeacherSchema)

const StudentSchema = new mongoose.Schema({
    first:{type:String,required:true},
    middle:{type:String,required:true},
    last:{type:String,required:true},
    gender:{type:String,required:true},
    age:{type:Number,required:true},
    sectionId:{type:mongoose.Schema.Types.ObjectId, ref:'Section',required:true},
    region:{type:String,required:true},
    city:{type:String,required:true},
    subCity:{type:String,required:true},
    wereda:{type:String,required:true},
    houseNo:{type:Number,required:true},
    studentPhoto:{type:String,required:true}
    
},
{ timestamps: true } 
)
const Student = mongoose.model('Student',StudentSchema)

const FamilySchema = new mongoose.Schema({
    familyPhoto:{type:String,required:true},
    familyFirst:{type:String,required:true},
    familyMiddle:{type:String,required:true},
    familyType:{type:String,required:true},
    familyLast:{type:String,required:true},
    familyPhone:{type:Number,required:true},
    familyEmail:{type:String,required:true},
    studentId:{type:mongoose.Schema.Types.ObjectId,ref:"Student",required:true}
})
const Family = mongoose.model('Family',FamilySchema)

module.exports = {Admin,Student,Family,Teacher}