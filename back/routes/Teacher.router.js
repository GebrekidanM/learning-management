const router = require('express').Router()
const {FiredTeacher} = require('../controller/Teacher.controller')


// it is for leaving teacher
router.post('teacher/leave',FiredTeacher );


module.exports = router