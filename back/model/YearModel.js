const mongoose =  require("mongoose")

const YearSchema = new mongoose.Schema({
    startPoint:{type:Date,required:true},
    endPoint:{type:Date,required:true},
    yearName:{type:Number,required:true}
})

const Year = mongoose.model('Year',YearSchema)

const gradeSchema = new mongoose.Schema({
    grade: {type: Number,enum:[1,2,3,4,5,6,7,8], default: 1, required: true},
    yearId:{type: mongoose.Schema.Types.ObjectId, ref: 'Year', required:true}
})
const Grade = mongoose.model('Grade', gradeSchema);

// Section Schema and Model
const SectionSchema = new mongoose.Schema({
    section: { type: String, required: true, enum: ['A', 'B', 'C', 'D', 'E', 'F'] },
    gradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true }
});
// Create an index to ensure the combination of gradeId and section is unique
SectionSchema.index({ gradeId: 1, section: 1 }, { unique: true });

const Section = mongoose.model('Section', SectionSchema); // Model name should match the reference


module.exports = {Year,Grade,Section};