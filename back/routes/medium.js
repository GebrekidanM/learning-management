const mongoose = require('mongoose')

const GradeTeacherSchema = new mongoose.Schema({
    teacherId:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher',required:true},
    Grade:{type:mongoose.Schema.Types.ObjectId,ref:'Grade',required:true},
    Section:[{type:mongoose.Schema.Types.ObjectId,ref:'Section',required:true}],
    yearId:{type:mongoose.Schema.Types.ObjectId,ref:'Year',required:true}
})
const GradeTeaher = mongoose.model('GradeTeacher',GradeTeacherSchema)

module.exports = {GradeTeaher}