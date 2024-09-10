const { default: mongoose } = require("mongoose")
const { Score } = require("../model/Score.model")

const ScoreOfAStudent = async(req,res)=>{
    const {studentId} = req.params

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({error:"Invalid Id"})
    }

    try {
         const students = await Score.aggregate([
            {$match:{studentId:new mongoose.Types.ObjectId(studentId)}},
            {$lookup:{
                from:'students',
                localField:"studentId",
                foreignField:'_id',
                as:'student'
            }},
            {$unwind:'$student'},
            {
                $lookup:{
                    from:'subjects',
                    localField:'subjectId',
                    foreignField:'_id',
                    as:'subjects'
                }
            },
            {$unwind:'$subjects'},
            {
                $project:{
                    _id:1,
                    value:1,
                    outOf:1,
                    description:1,
                    round:1,
                    date:1,
                    'student._id':1,
                    'student.first':1,
                    'student.middle':1,
                    'student.last':1,
                    'student.age':1,
                    'student.gender':1,
                    'subjects._id':1,
                    'subjects.name':1
                }
            }
         ])
         if(students.length == 0){
            return res.status(404).json({error:"No scores found for this Student"})
        }

        const months = [...new Set(students.map(student=>(
            new Date(student.date).toLocaleString('default',{month:'long'})
        )))]

        const examSet = new Map()
        students.map(student=>{
            const month = new Date(student.date).toLocaleString('default',{month:'long'})
            const key = `${student.description}-${student.outOf}-${student.round}-${month}`
            if(!examSet.has(key)){
                examSet.set(key,{
                    description: student.description,
                    outOf:student.outOf,
                    round:student.round,
                    month
                })
            }
        })

        const exams = [...examSet.values()]
        res.status(200).json({students,months,exams})

    } catch (error) {
        res.status(500).json({error:"Hi"+error.message})
    }
}

const ScoreOfStudentsForASubject = async (req, res) => {
    const { subjectId } = req.params;

    try {
        const scores = await Score.find({ subjectId })
            .populate({ path: 'studentId', select: 'first middle last age gender' })
            .populate({ path: 'teacherId', select: 'first middle last' });

        if (scores.length === 0) {
            return res.status(404).json({ error: 'No scores found for this subject' });
        }

        // Extract unique months in chronological order
        const months = [...new Set(scores.map(score => 
            new Date(score.date).toLocaleString('default', { month: 'long' })
        ))].sort((a, b) => new Date(`${a} 01, 2020`) - new Date(`${b} 01, 2020`)); // Sorting by month order

        // Extract unique exams
        const examSet = new Map();
        scores.forEach(score => {
            const month =  new Date(score.date).toLocaleString('default', { month: 'long' });
            const key = `${score.description}-${score.outOf}-${score.round}-${month}`; // Combine description, outOf, and round
            if (!examSet.has(key)) {
                examSet.set(key, { 
                    description: score.description, 
                    outOf: score.outOf, 
                    round: score.round,
                    month
                });
            }
        });

        const exams = Array.from(examSet.values());
        res.json({ scores, months, exams });
    } catch (err) {
        res.status(500).json({ error: 'Server error occurred while fetching scores' });
    }
}

const CreatingScore = async (req, res) => {
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
}

module.exports = {
    ScoreOfAStudent,
    ScoreOfStudentsForASubject,
    CreatingScore
}