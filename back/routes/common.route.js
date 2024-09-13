const { DeleteFamilyAndStudent, getUserDetails, userLogOut, userLogIn } = require('../controller/common.controller')
const verifyToken = require('../middleware/verifyToken')

const router = require('express').Router()

router.delete('/delete/:id',DeleteFamilyAndStudent)
router.post('/user/',userLogIn)
router.get('/user/profile',verifyToken,getUserDetails)
router.get('/user/logout',userLogOut)

module.exports = router