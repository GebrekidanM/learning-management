const mongoose = require('mongoose')

const TeacherSchema = new mongoose.Schema({
    first: { type: String, required: true },
    middle: { type: String, required: true },
    last: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    subCity: { type: String, required: true },
    wereda: { type: String, required: true },
    houseNo: { type: Number, required: true },
    teacherPhoto: { type: String, required: true },
    experience: { type: Number, required: true },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        match: [/.+@.+\..+/, 'Please fill a valid email address'] // Email validation
    },
    phoneNo: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid phone number'] // Basic phone number validation
    },
    yearId: { type: mongoose.Schema.Types.ObjectId, ref: 'Year', required: true },
    isActive: {type:Boolean, default:true}
});

// Indexes
TeacherSchema.index({ email: 1 });
TeacherSchema.index({ phoneNo: 1 });

const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = {Teacher}