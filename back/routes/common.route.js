const { DeleteFamilyAndStudent, getUserDetails, userLogOut, userLogIn ,changePassword} = require('../controller/common.controller')
const {verifyToken, onlyForAdmin, onlyForTeacher} = require('../middleware/verifyToken')

const router = require('express').Router()

router.delete('/delete/:id',verifyToken,onlyForAdmin,DeleteFamilyAndStudent)
router.post('/user/',userLogIn)
router.get('/user/profile',verifyToken,getUserDetails)
router.get('/user/logout',userLogOut)
router.patch('/user/password/:id',verifyToken,changePassword)
module.exports = router