const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const TeacherSchema = new mongoose.Schema({
    userId:{
      type:String,
      required:[true,'userId is required'],
      trim:true,minlength:[7, 'Its length must seven'],
      unique:[true,'UserId must be unique, try again']
    },
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
        required: [true, 'Gender is required.'],
        enum: ['Male', 'Female', 'Other'], // Restrict values to these options
      },
      age: {
        type: Number,
        required: [true, 'Age is required.'],
        min: [0, 'Age must be a positive number.'],
        max: [120, 'Age cannot exceed 120 years.'], // Assuming 120 as a reasonable upper age limit
      },
      region: {
        type: String,
        required: [true, 'Region is required.'],
        trim: true,
        minlength: [2, 'Region must be at least 2 characters long.'],
        maxlength: [100, 'Region cannot exceed 100 characters.'],
      },
      city: {
        type: String,
        required: [true, 'City is required.'],
        trim: true,
        minlength: [2, 'City must be at least 2 characters long.'],
        maxlength: [100, 'City cannot exceed 100 characters.'],
      },
      subCity: {
        type: String,
        required: [true, 'Sub-city is required.'],
        trim: true,
        minlength: [2, 'Sub-city must be at least 2 characters long.'],
        maxlength: [100, 'Sub-city cannot exceed 100 characters.'],
      },
      wereda: {
        type: String,
        required: [true, 'Wereda is required.'],
        trim: true,
        minlength: [1, 'Wereda must be at least 1 character long.'],
        maxlength: [50, 'Wereda cannot exceed 50 characters.'],
      },
      houseNo: {
        type: Number,
        required: [true, 'House number is required.'],
        min: [1, 'House number must be a positive integer.'],
        max: [99999, 'House number cannot exceed 99999.'],
      },
    teacherPhoto: { type: String, required: true },
    experience: {
        type: Number,
        required: [true, 'Experience is required.'],
        min: [0, 'Experience must be a positive number.'],
        max: [50, 'Experience cannot exceed 50 years.'],
        validate: {
        validator: Number.isInteger,
        message: 'Experience must be an integer value.',
        },
    },
    role:{type:String,enum:['Teacher'],default:'Teacher'},
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

// Hash the password before saving
TeacherSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Indexes
TeacherSchema.index({ email: 1 });
TeacherSchema.index({ phoneNo: 1 });

const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = {Teacher}