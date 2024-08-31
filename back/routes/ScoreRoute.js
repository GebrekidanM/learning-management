const { default: mongoose } = require('mongoose')
const { Score } = require('../model/ScoreModel')

const router = require('express').Router()

//creating score
router.get('/subject/:subjectId',async(req,res)=>{
    const {subjectId} = req.params

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        res.status(400).json({error:"Invalid Id"})
    }

    try {
        const subject = await Score.find({subjectId})
        if(subject.length == 0){
            res.status(404).json({error:"Not Found"})
        }else{
            res.status(200).json(subject)
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }

})

/// Route to add a new score or update if exists
router.post('/', async (req, res) => {
    const { studentId, subjectId, sectionId, teacherId, value, outOf, description } = req.body;

    try {
        // Find if a score document exists for the given student, subject, and section
        let existingScore = await Score.findOne({ studentId, subjectId, sectionId });

        if (existingScore) {
            // Update the existing document by pushing a new score
            await Score.updateOne(
                { _id: existingScore._id },
                {
                    $push: {
                        scores: {
                            teacherId,
                            value,
                            outOf,
                            description
                        }
                    }
                }
            );
            res.status(200).json({ message: 'Score updated successfully.' });
        } else {
            // Create a new score document
            const newScore = await Score.create({
                studentId,
                subjectId,
                sectionId,
                scores: [
                    {
                        teacherId,
                        value,
                        outOf,
                        description
                    }
                ]
            });
            res.status(201).json({ message: 'Score created successfully.', newScore });
        }
    } catch (error) {
        console.error('Error adding/updating score:', error);
        res.status(500).json({ message: 'An error occurred while processing the score.', error });
    }
});
module.exports = router