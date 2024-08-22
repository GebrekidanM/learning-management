const mongoose = require('mongoose')

const SubjectSchema = new mongoose.Schema({
    subject:{type:String,required:true}
})

const Subject = mongoose.model('Subject',SubjectSchema)

module.exports = {Subject}