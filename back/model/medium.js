const mongoose = require('mongoose');

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
    }]
});

// Ensure that each combination of teacher, section, and subject is unique
TeacherSectionSubjectSchema.index({ teacherId: 1, sectionId: 1, subjectId: 1, yearId: 1 }, { unique: true });

const TeacherSectionSubject = mongoose.model('TeacherSectionSubject', TeacherSectionSubjectSchema);

module.exports = { TeacherSectionSubject };
