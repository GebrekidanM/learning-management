const { default: mongoose } = require('mongoose');
const {Family} = require('../model/Student_Family.model')

//function to change capitalization
function capitalizeFirstLetter(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function Password(name){
    return name + '@011';
}



const GetFamilyOfStudentByS_id = async (req, res) => {
    const { id } = req.params;

    // Validate if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid student ID format!" });
    }

    try {
        // Find families associated with the student ID
        const family = await Family.find({ studentId: id });

        // Check if any families were found
        if (family.length === 0) {
            return res.status(404).json({ error: "Family not found for this student!" });
        }

        // Return the found families
        res.status(200).json({ family });
    } catch (error) {
        // Provide more details about the server error
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

const GetOneFamilyWithStudentInfo = async(req,res)=>{
    const {id} = req.params

     // Validate if the provided ID is a valid MongoDB ObjectID
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid student ID format!" });
    }

    try {
        const family = await Family.find({_id:id}).populate({
            path:'studentId',
            select:'-studentPhoto -createdAt -updatedAt -gender -age -_id -last'
        })
        if(!family){
            return res.status(404).json({error:"Not found!"})
        }
        res.status(200).json(family)
    } catch (error) {
        res.status(500).json({error:"Server error"})
    }
}

const GetOneFamily = async(req,res)=>{
    const {id} = req.params

     // Validate if the provided ID is a valid MongoDB ObjectID
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid student ID format!" });
    }

    try {
        const family = await Family.find({_id:id})
        if(!family){
            return res.status(404).json({error:"Not found!"})
        }
        res.status(200).json(family)
    } catch (error) {
        res.status(500).json({error:"Server error"})
    }
}

const CreateFamily = async(req,res)=>{
    const {familyFirst,familyLast,familyMiddle,familyType,familyEmail,familyPhone,studentId} = req.body
    const familyPhoto = req.file.filename
    const password = Password(capitalizeFirstLetter(familyFirst))

    try {
        const family = await Family.create({familyFirst:capitalizeFirstLetter(familyFirst),familyLast:capitalizeFirstLetter(familyLast),familyMiddle:capitalizeFirstLetter(familyMiddle),password,familyType,familyEmail,familyPhone,familyPhoto,studentId})
        if(!family){
            return res.status(400).json({error:"Something is wrong please try again"})
        }
        res.status(200).json(family)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const ValidationError = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: ValidationError});
        }
        
        res.status(500).json({ error: error.message });
    }
}

const AllFamilies = async(req,res)=>{

    try {
        const family = await Family.find({}).populate({
            path: 'studentId',
            select: 'first middle sectionId',
            populate:({
                path:'sectionId',
                populate:({
                    path:'gradeId',
                    select:'grade'
                })
            })
        });
        if(!family){
            return res.status(404).json({error:"Not found!"})
        }
        res.status(200).json(family)
    } catch (error) {
        res.status(500).json({error:"Server error"})
    }
}

const UpdateFamily =  async (req, res) => {
    const { familyId } = req.params;
    const updates = req.body;

    // Check if the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(familyId)) {
        return res.status(404).json({ error: 'Invalid ID!' });
    }
    if (req.file) {
        updates.familyPhoto = req.file.filename;
    }

    try {
        const updatedFamily = await Family.findByIdAndUpdate(familyId, updates, { new: true, runValidators: true });
        if (!updatedFamily) {
            return res.status(404).json({ error: 'Family not found!' });
        }
        res.status(200).json(updatedFamily);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
                GetFamilyOfStudentByS_id,
                GetOneFamily,
                GetOneFamilyWithStudentInfo,
                CreateFamily,
                AllFamilies,
                UpdateFamily,
            }