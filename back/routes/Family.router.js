const { GetOneFamily, GetOneFamilyWithStudentInfo, GetFamilyOfStudentByS_id, CreateFamily, AllFamilies, UpdateFamily, DeleteFamily } = require('../controller/Family.controller')

const router = require('express').Router()

//get family with student id
router.get('/family/:id',GetFamilyOfStudentByS_id)
/// get family with family id
router.get('/family/own/:id',GetOneFamilyWithStudentInfo)
/// get family with family id
router.get('/family/only/:id',GetOneFamily)
//register family
router.post('/family', upload.single('familyPhoto'), CreateFamily)
//get all families
router.get('/families',AllFamilies)
//update family
router.patch('/family/update/:familyId', upload.single('familyPhoto'),UpdateFamily);
//Delete family
router.delete('/family/delete/:id', DeleteFamily);


