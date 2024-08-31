const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student ID is required.'],
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject ID is required.'],
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: [true, 'Section ID is required.'],
    },
    scores: [{
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            required: [true, 'Teacher ID is required.'],
        },
        value: {
            type: Number,
            required: [true, 'Score value is required.'],
            min: [0, 'Score value cannot be negative.'],
            max: [100, 'Score value cannot exceed 100.'], // Assuming 100 is the maximum score
        },
        outOf: {
            type: Number,
            required: [true, 'OutOf value is required.'],
            min: [1, 'OutOf value must be at least 1.'],
            validate: {
                validator: function(value) {
                    // Ensure 'value' does not exceed 'outOf'
                    return value >= this.value;
                },
                message: 'OutOf value must be greater than or equal to the score value.'
            }
        },
        description: {
            type: String,
            trim: true,
            maxlength: [100, 'Description cannot exceed 100 characters.'], // Limit description length
        },
        date: {
            type: Date,
            required: [true, 'Date is required.'],
            default: Date.now,
        }
    }]
});

// Add a compound index to prevent duplicate scores for the same student, subject, and section
ScoreSchema.index({ studentId: 1, subjectId: 1, sectionId: 1 }, { unique: true });

const Score = mongoose.model('Score', ScoreSchema);

module.exports = { Score };
