const { default: mongoose } = require('mongoose');
const {Student} = require('../model/Student_Family.model')
const generateId = require('../utilities/GenerateId')
function capitalizeFirstLetter(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function Password(name){
    return name + '@011';
}

const CreateStudent = async (req, res) => {
    const {first, middle, last, gender, age, region, city, subCity, wereda, houseNo, sectionId ,yearName} = req.body;
    const studentPhoto = req.file.filename

    const role = "Student"

    const userId = generateId(yearName,role) 

    console.log(userId)
    const password = Password(capitalizeFirstLetter(first))
    try {
        const student = await Student.create({first:capitalizeFirstLetter(first), middle:capitalizeFirstLetter(middle), last:capitalizeFirstLetter(last), password,gender, age, userId,region, city, subCity, wereda, houseNo, sectionId,studentPhoto})
        if(student){
            res.status(200).json(student)
        }else{
            res.status(400).json({error:"Something is wrong!"})
        }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const ValidationError = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: ValidationError });
        }
        
        res.status(500).json({ error: error.message });
    }
}

const GetOneStudent = async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:"Not valid id!"})
    }
    try {
        const student = await Student.findById(id).populate({
            path: 'sectionId',
            populate: {
                path: 'gradeId',
                populate: {
                    path: 'yearId'
                }
            }
        });
        if(Student){
            res.status(200).json({student})
        }else{
            res.status(404).json({error:"No student!"})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const GetOneStudentWithExtraInfo = async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:"Not valid id!"})
    }
    try {
        const student = await Student.findById(id)
        if(Student){
            res.status(200).json({student})
        }else{
            res.status(404).json({error:"No student!"})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const GetAllStudents = async(req,res)=>{
    try {
        const students = await Student.find({}).populate('sectionId')
        if(students){
            res.status(200).json({students})
        }else{
            res.status(400).json({eroor:"Not found!"})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const OneSectionStudents = async (req, res) => {
    const { sectionId } = req.params;
    if(!mongoose.Types.ObjectId.isValid(sectionId)){
        res.status(400).json({error:"InValid setion Id"})
    }
    try {
        const students = await Student.find({sectionId}).sort({first:1})
        if (students.length === 0) {
            return res.status(404).json({ error: "There are no students in this class" });
        }

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'An internal server error occurred. Please try again later.' });
    }
}

const UpdateStudent = async (req, res) => {
    const { studentId } = req.params;
    const updates = req.body;

    // Check if the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(404).json({ error: 'Invalid ID!' });
    }
    if (req.file) {
        updates.studentPhoto = req.file.filename; 
    }

    try {
        const updatedStudent = await Student.findByIdAndUpdate(studentId, updates, { new: true, runValidators: true });
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found!' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const NumberOfStudentForEachGradeAndSection = async(req,res)=>{
    try {
        const NumberOfStudents = await Student.aggregate([
            //looking for students section
            {
                $lookup:{
                    from:'sections', //name of collection
                    localField:'sectionId',
                    foreignField:'_id',
                    as:'section'
                }
            },
            //change an array to plane
            {$unwind:'$section'},
            //looking for grade inside 'section'
            {$lookup:{
                from:'grades',
                localField:'section.gradeId',
                foreignField:'_id',
                as:'grade'
            }},
            //unwind grade
            {$unwind:'$grade'},
            {
                $group: {
                  _id: {
                    grade: '$grade.grade',
                    section: '$section.section'
                  },
                  studentCount: { $sum: 1 }
                }
            },
            {
                $project:{
                    _id:0,
                    grade:'$_id.grade',
                    section:'$_id.section',
                    studentCount:1
                }

            },
            {$sort:{grade:1,section:1}}
        ])
        if(NumberOfStudents){
            res.status(200).json(NumberOfStudents)
        }else{
            res.status(404).json({error:'Not found'})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

module.exports = {
                    CreateStudent,
                    GetOneStudent, 
                    GetOneStudentWithExtraInfo, 
                    GetAllStudents, 
                    OneSectionStudents,
                    UpdateStudent,
                    NumberOfStudentForEachGradeAndSection
                }