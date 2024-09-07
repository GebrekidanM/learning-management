const mongoose =  require("mongoose")

const AdminSchema = new mongoose.Schema ({
    username:{type: String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    role:{type:Number,enum:[1,2],default:2,required:true},//1 for writer 2 director
    password:{type:String,required:true}
})

const Admin = mongoose.model("User", AdminSchema)

const StudentSchema = new mongoose.Schema(
  {
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
    }
  },
  { timestamps: true }
);

StudentSchema.index({ sectionId: 1 });

const Student = mongoose.model('Student', StudentSchema);

const FamilySchema = new mongoose.Schema({
    familyPhoto:{type:String,required:true},
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
    familyType: {
      type: String,
      required: [true, 'Family type is required.'],
      trim: true,
      enum: ['Parent', 'Sibling', 'Spouse', 'Child', 'Other'],
      minlength: [2, 'Family type must be at least 2 characters long.'],
      maxlength: [30, 'Family type cannot exceed 30 characters.'],
    },
    familyLast: {
      type: String,
      required: [true, 'Family last name is required.'],
      trim: true,
      minlength: [2, 'Family last name must be at least 2 characters long.'],
      maxlength: [50, 'Family last name cannot exceed 50 characters.'],
    },
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
    familyEmail: {
        type: String,
        required: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'] // Email validation
    },
    familyPhone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid phone number'] // Basic phone number validation
    },
    studentId:{type:mongoose.Schema.Types.ObjectId,ref:"Student",required:true}
})
const Family = mongoose.model('Family',FamilySchema)

module.exports = {Admin,Student,Family}