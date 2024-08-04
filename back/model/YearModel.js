const mongoose =  require("mongoose")

const YearSchema = new mongoose.Schema({
    startPoint:{type:Date,required:true},
    endPoint:{type:Date,required:true},
    yearName:{type:Number,required:true}
})
const YearModel = mongoose.model('Year',YearSchema)

const gradeSchema = new mongoose.Schema({
    grade: {
        type: Number,
        min: 1,
        max: 8,
        default: 1,
        required: true
      }
})

const GradeModel = mongoose.model('Grade', gradeSchema);

module.exports = {YearModel,GradeModel};