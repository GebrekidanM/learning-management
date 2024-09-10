const { SubjectInOneSection, CreatingSubject, ChangeSubjectName, deleteSubject } = require('../controller/Subject.controller');

const router = require('express').Router()


// geting subjects in one section
router.get('subject/subjects/:sectionId', SubjectInOneSection)
// creating subject
router.post('/create', CreatingSubject);
//change the name of subject
router.put('/update/:id', ChangeSubjectName);

  router.delete('/delete/:id', deleteSubject);

module.exports = router