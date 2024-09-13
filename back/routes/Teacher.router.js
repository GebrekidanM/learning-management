const router = require('express').Router()
const {
        FiredTeacher,
        CreatingATeacher,
        GetOneTeacher,
        GetAllTeachers,
        UpdateTeaacher
    } = require('../controller/Teacher.controller');
const upload = require('../upload');


// it is for leaving teacher
router.post('teacher/leave',FiredTeacher );
//to create a teacher
router.post('/teacher', upload.single('teacherPhoto'), CreatingATeacher);
//get teacher by id
router.get('/teacher/:teacherId',GetOneTeacher)
// Get all teachers with optional filters and search query
router.get('/teachers', GetAllTeachers);
//update teacher
router.patch('/teacher/update/:teacherId', upload.single('teacherPhoto'),UpdateTeaacher );
module.exports = router