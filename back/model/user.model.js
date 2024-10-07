const mongoose =  require("mongoose")
const {isEmail, isMobilePhone} = require('validator')

const AdminSchema = new mongoose.Schema ({
    userId:{
        type:String,
        required:[true,'userId is required'],
        trim:true,minlength:[7, 'Its length must seven'],
        unique:[true,'UserId must be unique, try again']},
    username:{type: String,required:[true,'First name is required!']},
    middle:{type:String,required:[true,'Middle name is required!']},
    last:{type:String,required:[true,'Last name is required!']},
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => isEmail(value),
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    phoneNo: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        validate: {
        validator: (value) => isMobilePhone(value, 'any', { strictMode: false }),  // 'any' means accept from any locale
        message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    role:{type:String,enum:['Editor','Admin'],default:'Admin',required:true},
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
    adminPhoto:{type:String},
    gender:{type:String,enum:['Male','Female'],required:[true,'Gender field is required']},
    age:{type:Number,required:[true,'Age is required!']},
    region:{type:String,required:[true,"Region is required"]},
    city:{type:String,required:[true,'City is required']},
    subCity:{type:String,required:[true,'subCity is required']},
    wereda:{type:String,required:[true,'Wereda is required']},
    houseNo:{type:Number,required:[true,'House number is required']},
})

AdminSchema.index({userId:1,email:1})
const Admin = mongoose.model("User", AdminSchema)

module.exports = {Admin}