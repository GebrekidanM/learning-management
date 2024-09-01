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
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: [true, 'Teacher ID is required.'],
    },
    value: {
        type: Number,
        required: [true, 'Score value is required.'],
        min: [0, 'Score value cannot be negative.'],
        max: [100, 'Score value cannot exceed 100.'],
    },
    outOf: {
        type: Number,
        required: [true, 'OutOf value is required.'],
        min: [1, 'OutOf value must be at least 1.'],
        validate: {
            validator: function (value) {
                return value >= this.value;
            },
            message: 'OutOf value must be greater than or equal to the score value.',
        },
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Description is required.'],
        maxlength: [100, 'Description cannot exceed 100 characters.'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required.'],
        default: Date.now,
    },
    round: {
        type: Number,
        required: [true, 'Round is required.'],
        min: [1, 'Round must be at least 1.'],
    },
});

// Index to ensure the round is unique globally
ScoreSchema.index({ studentId: 1, subjectId: 1, teacherId: 1, round: 1 }, { unique: true });

const Score = mongoose.model('Score', ScoreSchema);

module.exports = { Score };
