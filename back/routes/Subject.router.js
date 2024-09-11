const { SubjectInOneSection, CreatingSubject, ChangeSubjectName, deleteSubject } = require('../controller/Subject.controller');

const router = require('express').Router()


// geting subjects in one section
router.get('/subject/subjects/:sectionId', SubjectInOneSection)
// creating subject
router.post('/subject/create', CreatingSubject);
//change the name of subject
router.put('/subject/update/:id', ChangeSubjectName);

  router.delete('/subject/delete/:id', deleteSubject);

module.exports = router