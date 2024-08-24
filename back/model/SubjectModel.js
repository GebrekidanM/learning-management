const mongoose = require('mongoose')

const SubjectSchema = new mongoose.Schema({
    name:{type:String,required:true},
    yearId:{type:mongoose.Schema.Types.ObjectId, ref:'Year',required:true}
})

const Subject = mongoose.model('Subject',SubjectSchema)

module.exports = {Subject}