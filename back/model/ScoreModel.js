const mongoose = require('mongoose')

const ScoreSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    scores: [{
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        outOf: {
            type: Number,
            required: true
        },
        description: { 
            type: String,
            default: '' // e.g "Midterm Exam", "Final Project"
        },
        date: {
            type: Date,
            required: true,
            default: Date.now // Default to the current date when the score is recorded
        }
    }]
});

const Score = mongoose.model('Score', ScoreSchema);

module.exports = {Score}