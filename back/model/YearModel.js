const mongoose = require('mongoose');

// Year Schema
const YearSchema = new mongoose.Schema({
    startPoint: {
        type: Date,
        required: [true, 'Start date is required.']
    },
    endPoint: {
        type: Date,
        required: [true, 'End date is required.'],
        validate: {
            validator: function(v) {
                return v > this.startPoint;
            },
            message: 'End date must be after start date.'
        }
    },
    yearName: {
        type: Number,
        required: [true, 'Year name is required.']
    }
});
const Year = mongoose.model('Year', YearSchema);

// Semester Schema
const SemesterSchema = new mongoose.Schema({
    yearId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Year',
        required: [true, 'Year ID is required.'],
        validate: {
            async validator(v) {
                const year = await Year.findById(v);
                return !!year;
            },
            message: 'Invalid year ID.'
        }
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required.']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required.'],
        validate: {
            validator: function(v) {
                return v > this.startDate;
            },
            message: 'End date must be after start date.'
        }
    },
    name: {
        type: Number,
        required: [true, 'Semester name is required.']
    }
});
const Semester = mongoose.model('Semester', SemesterSchema);

// Grade Schema
const gradeSchema = new mongoose.Schema({
    grade: {
        type: Number,
        required: [true, 'Grade is required.'],
        min: [1, 'Grade must be at least 1.'],
        max: [8, 'Grade cannot exceed 8.']
    },
    yearId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Year',
        required: [true, 'Year ID is required.'],
        validate: {
            async validator(v) {
                const year = await Year.findById(v);
                return !!year;
            },
            message: 'Invalid year ID.'
        }
    },
    semesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        required: [true, 'Semester ID is required.'],
        validate: {
            async validator(v) {
                const semester = await Semester.findById(v);
                return !!semester;
            },
            message: 'Invalid semester ID.'
        }
    }
});
const Grade = mongoose.model('Grade', gradeSchema);

// Section Schema
const SectionSchema = new mongoose.Schema({
    section: {
        type: String,
        required: [true, 'Section is required.'],
        enum: ['A', 'B', 'C', 'D', 'E', 'F'] // Adjust based on your needs
    },
    gradeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grade',
        required: [true, 'Grade ID is required.'],
        validate: {
            async validator(v) {
                const grade = await Grade.findById(v);
                return !!grade;
            },
            message: 'Invalid grade ID.'
        }
    }
});
SectionSchema.index({ gradeId: 1, section: 1 }, { unique: true });

const Section = mongoose.model('Section', SectionSchema);

// Example Route with Error Handling
const express = require('express');
const router = express.Router();

router.post('/create-year', async (req, res) => {
    const { startPoint, endPoint, yearName } = req.body;
    try {
        const year = new Year({ startPoint, endPoint, yearName });
        await year.save();
        res.status(201).json({ message: 'Year created successfully.' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
});

module.exports = { Year, Grade, Section, Semester, router };
