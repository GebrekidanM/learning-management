const { default: mongoose } = require('mongoose');
const {Family} = require('../model/Student_Family.model');
const {Student} = require('../model/Student_Family.model');
const generateId = require('../utilities/GenerateId');
const bcrypt = require('bcrypt')
//function to change capitalization
function capitalizeFirstLetter(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function Password(name){
    return name + '@011';
}

//the correct one
const GetFamilies = async (req, res) => {
    try {
        const family = await Family.find().sort({createdAt:1});

        if (family.length === 0) {
            return res.status(404).json({ error: "Family not found!" });
        }
        res.status(200).json(family);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

const CreateFamily = async(req,res)=>{
    const {familyFirst,familyLast,familyMiddle,familyEmail,familyPhone,yearName} = req.body
    const familyPhoto = req.file.filename
    const role = 'Family'
    const userId = generateId(yearName,role) 

    const password = Password(capitalizeFirstLetter(familyFirst))
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const family = await Family.create({familyFirst:capitalizeFirstLetter(familyFirst),familyLast:capitalizeFirstLetter(familyLast),familyMiddle:capitalizeFirstLetter(familyMiddle),userId,password:hashedPassword,familyEmail,phoneNo:familyPhone,familyPhoto})
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

const getOneFamilyById = async(req,res)=>{
  const {id} = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid ID!' });
}
  try {
        const family = await Family.findOne({_id:id})
        if (!family) {
            return res.status(404).json({ error: "Family not found!" });
        }
        res.status(200).json(family);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}


const AllFamilies = async (req,res) => {
  try {
    const studentsWithFamilies = await Student.find()
      .populate({
        path: 'families.family',
        select: 'familyFirst familyMiddle familyLast familyEmail phoneNo'
      })
      .select('first middle last families')
      .exec();

    const groupedByFamily = {};

    studentsWithFamilies.forEach(student => {
      student.families.forEach(familyEntry => {
        const family = familyEntry.family;
        const familyType= familyEntry.type;
        if (family) {
          const familyId = family._id.toString();

          if (!groupedByFamily[familyId]) {
            groupedByFamily[familyId] = {
              familyDetails: family,
              students: [],
              familyType
            };
          }

          groupedByFamily[familyId].students.push({
            studentId: student._id,
            first: student.first,
            middle: student.middle,
            last: student.last
          });
        }
      });
    });

    res.status(200).json(groupedByFamily);
  } catch (error) {
    res.status(500).json({error:'Error grouping students by family.'});
  }
};

const UpdateFamily =  async (req, res) => {
    const { familyId } = req.params;
    const updates = req.body;

    if(!req.userId) return res.status(401).json({error:"Un Autherized"});

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

const getTotalFamilies = async (req, res) => {
  try {
    const totalFamilies = await Family.countDocuments();
    if (totalFamilies === 0) {
      return res.status(404).json({ error: "No families found" });
    }
    return res.status(200).json(totalFamilies);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving total number of families' });
  }
};


module.exports = {
                GetFamilies,
                CreateFamily,
                AllFamilies,
                UpdateFamily,
                getOneFamilyById,
                getTotalFamilies
            }