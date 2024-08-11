const mongoose =  require("mongoose")

const YearSchema = new mongoose.Schema({
    startPoint:{type:Date,required:true},
    endPoint:{type:Date,required:true},
    yearName:{type:Number,required:true}
})

const YearModel = mongoose.model('Year',YearSchema)

const gradeSchema = new mongoose.Schema({
    grade: {type: Number,enum:[1,2,3,4,5,6,7,8], default: 1, required: true},
    yearId:{type: mongoose.Schema.Types.ObjectId, ref: 'YearModel', required:true}
})
const GradeModel = mongoose.model('Grade', gradeSchema);

const SectionSchema = new mongoose.Schema({
    section:{type:String, required:true, enum:['A','B','C','D','E','F']},
    gradeId:{type: mongoose.Schema.Types.ObjectId, ref:'GradeModel', required:true}
})
const SectionModel = mongoose.model('Section',SectionSchema)

module.exports = {YearModel,GradeModel,SectionModel};