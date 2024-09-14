const { ScoreOfAStudent, ScoreOfStudentsForASubject, CreatingScore } = require('../controller/Score.controller');
const { onlyForTeacher, verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router()

//getting students score information
router.get('/score/student/:studentId',ScoreOfAStudent)

// get scores of students for one Subject subject
router.get('/score/:subjectId', ScoreOfStudentsForASubject);

//creating score 
router.post('/score/', verifyToken,onlyForTeacher,CreatingScore);
module.exports = router