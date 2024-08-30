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
    first: { type: String, required: true, trim: true },
    middle: { type: String, required: true, trim: true },
    last: { type: String, required: true, trim: true },
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
    region: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    subCity: { type: String, required: true, trim: true },
    wereda: { type: String, required: true, trim: true },
    houseNo: { type: Number, required: true, min: 1 },
    studentPhoto: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  },
  { timestamps: true }
);

StudentSchema.index({ sectionId: 1 });

const Student = mongoose.model('Student', StudentSchema);

const FamilySchema = new mongoose.Schema({
    familyPhoto:{type:String,required:true},
    familyFirst:{type:String,required:true},
    familyMiddle:{type:String,required:true},
    familyType:{type:String,required:true},
    familyLast:{type:String,required:true},
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