const mongoose = require('mongoose')

const SectionTeacherSchema = new mongoose.Schema({
    teacherId:{type:mongoose.Schema.Types.ObjectId, ref:'Teacher', required:true},
    SectionId:[{type:mongoose.Schema.Types.ObjectId, ref:'Section', required:true}],
    SubjectId:[{type:mongoose.Schema.Types.ObjectId, ref:'Subject', required:true}],
})
const SectionTeacher = mongoose.model('GradeTeacher', SectionTeacherSchema)

module.exports = {SectionTeacher}