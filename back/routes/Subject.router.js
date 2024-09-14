const { SubjectInOneSection, CreatingSubject, ChangeSubjectName, deleteSubject } = require('../controller/Subject.controller');
const { onlyForAdmin, verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router()


// getting subjects in one section
router.get('/subject/subjects/:sectionId', SubjectInOneSection)
// creating subject
router.post('/subject/create',verifyToken, onlyForAdmin,CreatingSubject);
//change the name of subject
router.put('/subject/update/:id',verifyToken,onlyForAdmin ,ChangeSubjectName);

router.delete('/subject/delete/:id',verifyToken,onlyForAdmin ,deleteSubject);

module.exports = router