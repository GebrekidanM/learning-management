const {
     CreateStudent, 
     GetOneStudent, 
     GetOneStudentWithExtraInfo, 
     GetAllStudents,
     OneSectionStudents,
     UpdateStudent,
     NumberOfStudentForEachGradeAndSection,
    } = require('../controller/Student.controller');
const upload = require('../upload');

const router = require('express').Router()

// Route to handle student creation
router.post('/student', upload.single('studentPhoto'),CreateStudent );
//get one student
router.get('/student/:id',GetOneStudent)
//get one student without additional information
router.get('/student/only/:id',GetOneStudentWithExtraInfo)
//get all students
router.get('/',GetAllStudents)
//get student by sectionId
router.get('/students/:sectionId', OneSectionStudents);
//update student information
router.patch('/student/updat/:studentId', upload.single('studentPhoto'), UpdateStudent);
//for number of students in each grae and section
router.get('/numberOfStudent',NumberOfStudentForEachGradeAndSection)

module.exports = router