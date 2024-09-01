const { default: mongoose } = require('mongoose')
const { Score } = require('../model/ScoreModel')

const router = require('express').Router()

router.get('/subject/:subjectId',async(req,res)=>{
    const {subjectId} = req.params

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        res.status(400).json({error:"Invalid Id"})
    }

    try {
        const subject = await Score.find({subjectId})
                        .populate({path:'studentId', select:'first middle last age gender'})
         
         if(subject.length == 0){
            res.status(404).json({error:"Not Found"})
        }else{
            res.status(200).json(subject)
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
    

})

// get scores using subject id
router.get('/:subjectId', async (req, res) => {
    const subjectId = req.params.subjectId;
    try {
        const scores = await Score.find({ subjectId })
            .populate({path:'studentId',select:('first middle last age gender')})
            .populate({path:'teacherId',select:('first middle last')});

        // Extract unique months and exam details
        const months = [...new Set(scores.map(score => new Date(score.date).toLocaleString('default', { month: 'long' })))];
        const exams = [...new Set(scores.map(score => ({ description: score.description, outOf: score.outOf })))];

        res.json({ scores, months, exams });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

//creating score 
router.post('/', async (req, res) => {
    const { studentId, subjectId, teacherId, value, outOf,round, description } = req.body;

    try {
            // Create a new score document
            const newScore = await Score.create({
                studentId,
                subjectId,
                teacherId,
                value,
                outOf,
                round,
                description,
            });
            res.status(201).json(newScore);
        
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ error:errors });
        }

        // Handle unique constraint errors (e.g., duplicate round)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ error: `Duplicate value for ${field}.` });
        }
        // Handle other types of errors (e.g., database connection issues)
        res.status(500).json({ error: 'An error occurred while processing the score.', error });
    }
});
module.exports = router