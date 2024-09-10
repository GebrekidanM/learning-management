const router = require('express').Router();
const { Score } = require('../model/Score.model');
const { AssignAteacherForSubject,
        ReAssignTeacherForSubject, 
        SectionsOfATeacher,
        AssignedSectionAndSubjectForATeacher,
        UpdateAssignment,

     } = require('../controller/TeacherSectionSubject.controller');

// Route to assign a subject to a teacher for a specific section
router.post('/medium/assign', AssignAteacherForSubject);
/*When a teacher changes their class or subject, we will:
    1. End their current assignment by setting an endDate.
    2. Create a new TeacherSectionSubject record with the new class/subject information.*/
router.post('/teacher/change-assignment',ReAssignTeacherForSubject)

// Route to get all assignments for a teacher
/*router.get('/medium/teacher/:teacherId', AllAssignmentOfTeacher);*/
// Route to get all assignments for a section
/*router.get('/medium/section/:sectionId', AllAssignmentOfASection);*/

//Route to get only one's teacher section
router.get('/medium/teacher/section/:teacherId',SectionsOfATeacher)

//get Assign sections and subjects for a teacher by using that id
router.get('medium/teacher/section/one/:idForDetail', AssignedSectionAndSubjectForATeacher)
// Route to update an assignment
router.put('medium/update/:id', UpdateAssignment);
// Route to delete an assignment
/*router.delete('/medium/delete/:id', DeleteAssignment);*/

module.exports = router;
