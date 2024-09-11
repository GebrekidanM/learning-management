const { DeleteFamilyAndStudent } = require('../controller/common.controller')

const router = require('express').Router()

//delete family or student
router.delete('/delete/:id',DeleteFamilyAndStudent)

module.exports = router