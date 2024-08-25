const mongoose = require('mongoose')

const SubjectSchema = new mongoose.Schema({
    name:{type:String,required:true},
    sectionId:{type:mongoose.Schema.Types.ObjectId, ref:'Subject',required:true}
})

const Subject = mongoose.model('Subject',SubjectSchema)

module.exports = {Subject}