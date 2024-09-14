const { GetOneFamily, GetOneFamilyWithStudentInfo, GetFamilyOfStudentByS_id, CreateFamily, AllFamilies, UpdateFamily } = require('../controller/Family.controller')
const { onlyForAdmin, verifyToken } = require('../middleware/verifyToken')
const upload = require('../upload')

const router = require('express').Router()

//get family with student id
router.get('/family/:id',GetFamilyOfStudentByS_id)
/// get family with family id
router.get('/family/own/:id',GetOneFamilyWithStudentInfo)
/// get family with family id
router.get('/family/only/:id',GetOneFamily)
//register family
router.post('/family', upload.single('familyPhoto'),verifyToken,onlyForAdmin, CreateFamily)
//get all families
router.get('/families',AllFamilies)
//update family
router.patch('/family/update/:familyId', upload.single('familyPhoto'),verifyToken,onlyForAdmin,UpdateFamily);


module.exports = router

