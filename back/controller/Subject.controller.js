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

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return res.status(400).json({ error: "Invalid section ID!" });
    }

    const capitalizedNames = name.map(sub => capitalizeFirstLetter(sub));

    try {
        const findSection = await Section.findById(sectionId);
        if (!findSection) {
            return res.status(404).json({ error: "No section with this ID!" });
        }

        const operations = capitalizedNames.map(subjectName => ({
            updateOne: {
                filter: { name: subjectName, sectionId },
                update: { $setOnInsert: { name: subjectName, sectionId } },
                upsert: true, // Insert if it doesn't exist
            },
        }));

        const result = await Subject.bulkWrite(operations);

        const insertedCount = result.upsertedCount;
        if (insertedCount === 0) {
            return res.status(400).json({ error: "All subjects already exist." });
        }

        res.status(201).json(`Successfully created ${insertedCount} subjects.`);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//change subject
const ChangeSubjectName = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if(!req.userId) return res.status(401).json({error:"Un Autherized"});

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
    if(!req.userId) return res.status(401).json({error:"Un Autherized"});

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