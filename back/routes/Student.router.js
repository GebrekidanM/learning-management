const {
     CreateStudent, 
     GetOneStudent, 
     GetOneStudentWithExtraInfo, 
     GetAllStudents,
     OneSectionStudents,
     UpdateStudent,
     NumberOfStudentForEachGradeAndSection,
     addFamilyToStudent,
    } = require('../controller/Student.controller');
const { onlyForAdmin, verifyToken } = require('../middleware/verifyToken');
const upload = require('../upload');

const router = require('express').Router()

// Route to handle student creation
router.post('/student', upload.single('studentPhoto'),verifyToken,onlyForAdmin,CreateStudent );
//get one student
router.post('/student/addfamily/:studentId',addFamilyToStudent)
router.get('/student/:id',GetOneStudent)
//get one student without additional information
router.get('/student/only/:id',GetOneStudentWithExtraInfo)
//get all students
router.get('/',GetAllStudents)
//get student by sectionId
router.get('/students/:sectionId', OneSectionStudents);
//update student information
router.patch('/student/updat/:studentId', upload.single('studentPhoto'),verifyToken,onlyForAdmin, UpdateStudent);
//for number of students in each grae and section
router.get('/numberOfStudent',NumberOfStudentForEachGradeAndSection)

module.exports = router