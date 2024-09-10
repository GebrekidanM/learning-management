const { Subject } = require('../model/Subject.model');
const { Section } = require('../model/YearModel');
const { default: mongoose } = require('mongoose');

function capitalizeFirstLetter(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const SubjectInOneSection = async(req,res)=>{
    const {sectionId} = req.params
    if(!mongoose.Types.ObjectId.isValid(sectionId)) return res.status(400).json({error:`${sectionId} is not valid Id!`});

    try {
        const getSubject = await Subject.find({sectionId})
        if(getSubject.length>0){
            res.status(200).json(getSubject)
        }else{
            res.status(404).json({error: 'No subject by this id!'})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const CreatingSubject = async (req, res) => {
    const { sectionId, name } = req.body;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return res.status(400).json({ error: "Invalid Id!" });
    }

    const capitalizedNames = name.map(capitalizeFirstLetter);

    try {
        // Check if the section exists
        const findSection = await Section.findOne({ _id: sectionId });
        if (!findSection) {
            return res.status(404).json({ error: "No section with this Id!" });
        }

        // Check for existing subjects
        for (const sub of capitalizedNames) {
            const findSubject = await Subject.findOne({ name: sub, sectionId });
            if (findSubject) {
                return res.status(400).json({ error: `The subject "${sub}" already exists.` });
            }
        }

        // Insert new subjects with capitalized names
        const newSubjects = capitalizedNames.map(subjectName => ({
            name: subjectName,
            sectionId
        }));

        await Subject.insertMany(newSubjects);
        res.status(201).json('Subjects created successfully!');

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
//change subject
const ChangeSubjectName = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    // Validate if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid subject ID format!' });
    }

    // Validate if the name is provided and not empty
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Subject name is required and must be a non-empty string!' });
    }

    try {
        const subject = await Subject.findByIdAndUpdate(id, { name: name.trim() }, { new: true, runValidators: true });

        // Check if the subject was found and updated
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found!' });
        }

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the subject', details: error.message });
    }
}

const deleteSubject = async (req, res) => {
    const { id } = req.params;

    // Validate if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid subject ID format!' });
    }

    try {
        const subject = await Subject.findByIdAndDelete(id);

        // Check if the subject was found and deleted
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found!' });
        }

        res.status(200).json('Subject deleted successfully');
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the subject', details: error.message });
    }
}

module.exports = {
                    SubjectInOneSection,
                    CreatingSubject,
                    ChangeSubjectName,
                    deleteSubject
                }