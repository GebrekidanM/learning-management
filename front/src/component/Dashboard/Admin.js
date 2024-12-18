import React, { useContext,useEffect,useState} from 'react'
import style from "../css/Dashbord.module.css"
import {useSearchParams} from 'react-router-dom' 
import Main from './UI/Main'
import LeftMenu from './UI/LeftMenu'
import Student from './pages/Student/Student'
import Schedule from './pages/Schedule'
import Family from './pages/Family/Family'
import Teacher from './pages/Teacher/Teacher'
import Grade from './pages/Grade'
import StudentEdit from './pages/Student/StudentEdit'
import Subject from './pages/Subject/Subject'

import AdminNav from './UI/AdminNav'
import { AuthContext } from '../../context/AuthContext'
import CreateStudent from './pages/Student/CreateStudent'
import StudentDetail from './pages/Student/StudentDetail'
import CreateFamily from './pages/Family/CreateFamily'
import TeacherDetail from './pages/Teacher/TeacherDetail'
import FamilyDetail from './pages/Family/FamilyDetail'
import FamilyEdit from './pages/Family/FamilyEdit'
import CreateSectionSubject from './pages/Grade/CreateSectionSubject'
import SectionCardDetail from './pages/Grade/SectionCardDetail'
import MarkList from '../UI/MarkList'
import LoadingIndicator from '../common/LoadingIndicator'
import ListOfStudents from './pages/Grade/ListOfStudents'
import CreateScore from './pages/Score/CreateScore'
import StudentResult from './pages/Student/StudentResult'
import ReportCard from './pages/ReportCard/ReportCard'
import CreateSection from './pages/Grade/CreateSection'
import GradeEdit from './pages/Grade/GradeEdit'
import ViewSection from './pages/Grade/ViewSection'
import TeacherEdit from './pages/Teacher/TeacherEdit'
import Class from './ForTeacher/Class'
import UpdateScore from './pages/Score/UpdateScore'
import AddFamily from './pages/Family/AddFamily'
import Profile from './UI/Profile'
import HomeClass from './pages/Teacher/HomeClass'

function Admin({year,yearId,semesterId,yearName}) {
  const [searchParams] = useSearchParams()
  const [loading,setLoading] = useState(false)
  const {loggedUser} = useContext(AuthContext)
 
  const { type: filterType, sectionId, studentId, card,result,info,subjectId,teacherId,update_score,action,addscoreSubjectId, idForDetail, family,familyId, Id,addfamily,gradeId,gradeViewId ,gradeEdit,semesterEdit} = Object.fromEntries([...searchParams]);
  const edit = searchParams.get('action')
  const stuEdit = searchParams.get('action')


  useEffect(() => {
    try {
    setLoading(true);
      if (loggedUser) {
        setLoading(false)
        }
    } finally{
      setLoading(false);
    }
    
  }, [loggedUser]);

  const renderPages = (filterType) => {
    switch (filterType) {
      case 'profile':
        return <Profile/>;
      case 'home':
        return <Main loggedUser={loggedUser} year={year}/>;
      case 'student':
        if (studentId) {
          return <StudentDetail studentId={studentId} />;
        }
        if(result){
          return <StudentResult studentId={result}/>
        }
        if(card){
          return <ReportCard studentId={card}/>
        }
        if (stuEdit && loggedUser.role==='Admin') {
          return <StudentEdit studentId={stuEdit} />;
        }
        return <Student semesterId={semesterId}/>;
      case 'grade':
        if (gradeId) {
          return <CreateSection gradeId={gradeId} />;
        }
        if (gradeViewId) {
          return <ViewSection gradeId={gradeViewId} />;
        }
        if (semesterEdit) {
          return <CreateSection yearId={semesterEdit} />;
        }
        if (gradeEdit) {
          return <GradeEdit semesterId={gradeEdit} />;
        }
        return <Grade  semesterId={semesterId} yearId={yearId}/>;
      case 'schedule':
        return <Schedule />;
      case 'subject':
        return <Subject semesterId={semesterId}/>;
      case 'parent':
        if (familyId) {
          return <FamilyDetail familyId={familyId} />;
        }
        if (edit) {
          return <FamilyEdit familyId={edit} />;
        }
        if(addfamily){
          return <CreateFamily yearName={addfamily}/>;
        }
        return <Family yearName={yearName} />;
      case 'teacher':
        if (teacherId) {
          return <TeacherDetail yearId={yearId} teacherId={teacherId}/>;
        }
        if (update_score) {
          return <UpdateScore />;
        }
        if(action){
          return <TeacherEdit teacherId={action} />
        }
        if(info){
          return <CreateScore teacherId={info} />
        }
        if (subjectId) {
          return <MarkList subjectId={subjectId} />;
        }
        if(Id){
          return <CreateSectionSubject semesterId={semesterId} teacherId={Id}/>
        }
        if(idForDetail){
          return <SectionCardDetail idForDetail={idForDetail}/>
        }
        if(addscoreSubjectId){
          return <ListOfStudents subjectId={addscoreSubjectId}/>
        }
        return <Teacher yearName={yearName} yearId={yearId}/>;
      case 'score':
        return;
      case 'class':
        return <Class/>;
      case 'homeclass':
          return <HomeClass/>;  
        default:
        return <Main  year={year} loggedUser={loggedUser}/>;
    }}

    if(loading){
      return <LoadingIndicator/>
    }

  return (
       <div className={style.dashContainer}>
          <AdminNav filterType={filterType} username={loggedUser.username} />
          <div className={style.dashBox}>
              {/** dashboard navigation */}
              <LeftMenu filterType={filterType} loggedUser={loggedUser}/>

              <div className={style.dashDisplay}>
                {filterType === 'student' && sectionId ? <CreateStudent sectionId={sectionId} />
                
                : filterType === 'student' && family?<AddFamily studentId={family}/>
                
                : renderPages(filterType)
                }
              </div>
          </div>
        </div>
  )
}

export default Admin
