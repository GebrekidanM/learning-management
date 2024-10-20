const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Student Schema
const StudentSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:[true,'userId is required'],
    trim:true,minlength:[7, 'Its length must seven'],
    unique:[true,'UserId must be unique, try again']},
  first: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long.'],
    maxlength: [50, 'First name cannot exceed 50 characters.'],
  },
  middle: {
    type: String,
    required: [true, 'Middle name is required.'],
    trim: true,
    minlength: [2, 'Middle name must be at least 2 characters long.'],
    maxlength: [50, 'Middle name cannot exceed 50 characters.'],
  },
  last: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long.'],
    maxlength: [50, 'Last name cannot exceed 50 characters.'],
  },
  gender: { 
    type: String, 
    required: true, 
    enum: ['Male', 'Female'],  
  },
  age: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 120,  
  },
  sectionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section', 
    required: true,
  },
  role: { type: String, enum: ['Student'], default: 'Student' },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters long.'],
    maxlength: [30, 'Password cannot exceed 30 characters.'],
    required: [true, 'Password is required.'],
    validate: {
      validator: function (value) {
        return /^(?=.*[A-Z])(?=.*\d).*$/.test(value);
      },
      message: 'Password must contain at least one uppercase letter and one number.',
    },
  },
  region: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  subCity: { type: String, required: true, trim: true },
  wereda: { type: String, required: true, trim: true },
  houseNo: { type: Number, required: true, min: 1 },
  studentPhoto: { 
    type: String, 
    required: true
  },
  families:[{
    family:{type: mongoose.Schema.Types.ObjectId,ref:"Family"},
    type:{
      type: String,
      trim: true,
      enum: ['Mother', 'Father', 'Uncle', 'Aunt', 'GrandMother', 'GrandFather', 'Other'],
      minlength: [2, 'Family type must be at least 2 characters long.'],
      maxlength: [30, 'Family type cannot exceed 30 characters.']
    }
  }],
  isActive: { type: Boolean, required: true, default: true }
}, { timestamps: true });


const Student = mongoose.model('Student', StudentSchema);

// Family Schema
const FamilySchema = new mongoose.Schema({
  userId:{
    type:String,
    required:[true,'userId is required'],
    trim:true,minlength:[7, 'Its length must seven'],
    unique:[true,'UserId must be unique, try again']},
  familyPhoto: { type: String, required: true },
  familyFirst: {
    type: String,
    required: [true, 'Family first name is required.'],
    trim: true,
    minlength: [2, 'Family first name must be at least 2 characters long.'],
    maxlength: [50, 'Family first name cannot exceed 50 characters.'],
  },
  familyMiddle: {
    type: String,
    required: [true, 'Family middle name is required.'],
    trim: true,
    minlength: [2, 'Family middle name must be at least 2 characters long.'],
    maxlength: [50, 'Family middle name cannot exceed 50 characters.'],
  },
 
  familyLast: {
    type: String,
    required: [true, 'Family last name is required.'],
    trim: true,
    minlength: [2, 'Family last name must be at least 2 characters long.'],
    maxlength: [50, 'Family last name cannot exceed 50 characters.'],
  },
  role: { type: String, enum: ['Family'], default: 'Family' },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters long.'],
    maxlength: [100, 'Password cannot exceed 100 characters.'],
    required: [true, 'Password is required.'],
    validate: {
      validator: function (value) {
        return /^(?=.*[A-Z])(?=.*\d).*$/.test(value);
      },
      message: 'Password must contain at least one uppercase letter and one number.',
    },
  },
  familyEmail: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'] // Email validation
  },
  phoneNo: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid phone number'] // Basic phone number validation
  },
});

FamilySchema.index({ userId: 1 });
const Family = mongoose.model('Family', FamilySchema);

module.exports = { Family, Student };
