const router = require('express').Router()
const {
        FiredTeacher,
        CreatingATeacher,
        GetOneTeacher,
        GetAllTeachers,
        UpdateTeaacher
    } = require('../controller/Teacher.controller');
const { onlyForAdmin } = require('../middleware/verifyToken');
const upload = require('../upload');


// it is for leaving teacher
router.post('teacher/leave',onlyForAdmin,FiredTeacher );
//to create a teacher
router.post('/teacher', upload.single('teacherPhoto'), onlyForAdmin,CreatingATeacher);
//get teacher by id
router.get('/teacher/:teacherId',GetOneTeacher)
// Get all teachers with optional filters and search query
router.get('/teachers', GetAllTeachers);
//update teacher
    router.patch('/teacher/update/:teacherId', upload.single('teacherPhoto'),onlyForAdmin,UpdateTeaacher );
module.exports = router