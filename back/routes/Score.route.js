const { ScoreOfAStudent, ScoreOfStudentsForASubject, CreatingScore, UpdateScore } = require('../controller/Score.controller');
const { onlyForTeacher, verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router()

//getting students score information
router.get('/score/student/:studentId',ScoreOfAStudent)

// get scores of students for one Subject subject
router.get('/score/:subjectId', ScoreOfStudentsForASubject);

//creating score 
router.post('/score/', verifyToken,onlyForTeacher,CreatingScore);
//update score 
router.put('/score/:subjectId',verifyToken,onlyForTeacher,UpdateScore );
module.exports = router