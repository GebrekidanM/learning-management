const {CreateFamily, AllFamilies, UpdateFamily, GetFamilies ,getOneFamilyById, getTotalFamilies} = require('../controller/Family.controller')
const { onlyForAdmin, verifyToken } = require('../middleware/verifyToken')
const upload = require('../upload')

const router = require('express').Router()
//get all family list
router.get('/onlyfamilies',GetFamilies)
//register family
router.post('/family', upload.single('familyPhoto'),verifyToken,onlyForAdmin, CreateFamily)
//get all families with their child
router.get('/families',AllFamilies)
//get one family by Id
router.get('/family/:id',getOneFamilyById)
//update family
router.patch('/family/update/:familyId', upload.single('familyPhoto'),verifyToken,onlyForAdmin,UpdateFamily);
//get total number of faamilies
router.get('/parent/number/all',getTotalFamilies)
module.exports = router

