const router = require('express').Router()
const {
        FiredTeacher,
        CreatingATeacher,
        GetOneTeacher,
        GetAllTeachers,
        UpdateTeaacher,
        getAllTeachersNumber,
    } = require('../controller/Teacher.controller');
const { onlyForAdmin, verifyToken, onlyForTeacher } = require('../middleware/verifyToken');
const upload = require('../upload');

// it is for leaving teacher
router.post('/teacher/leave',verifyToken,onlyForAdmin,FiredTeacher );
//to create a teacher
router.post('/teacher', upload.single('teacherPhoto'), verifyToken,onlyForAdmin,CreatingATeacher);
//get teacher by id
router.get('/teacher/:teacherId',GetOneTeacher)
// Get all teachers with optional filters and search query
router.get('/teachers', GetAllTeachers);
//update teacher
router.patch('/teacher/update/:teacherId', upload.single('teacherPhoto'),verifyToken,onlyForAdmin,UpdateTeaacher );
router.get('/teacher/number/all', getAllTeachersNumber);
//hometeacher
router.get('/teacher/class/home')
module.exports = router