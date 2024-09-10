const mongoose = require('mongoose')

const TeacherSectionSubjectSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    }],
    startDate: {
        type: Date,
        default: Date.now, // Automatically set to the current date
        required: true
    },
    endDate: {
        type: Date // Will be set when the teacher stops teaching this class/subject
    },
    yearId: { type: mongoose.Schema.Types.ObjectId, ref: 'Year', required: true }
});

TeacherSectionSubjectSchema.index({ teacherId: 1, sectionId: 1, subjects: 1, yearId: 1 }, { unique: true });

const TeacherSectionSubject = mongoose.model('TeacherSectionSubject', TeacherSectionSubjectSchema);

module.exports = {TeacherSectionSubject}