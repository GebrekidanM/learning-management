import React, { useContext,useEffect,useState} from 'react'
import style from "../css/Dashbord.module.css"
import {useSearchParams, NavLink} from 'react-router-dom' 
import Main from './pages/Main'
import Student from './pages/Student/Student'
import Schedule from './pages/Schedule'
import Family from './pages/Family/Family'
import Teacher from './pages/Teacher/Teacher'
import Grade from './pages/Grade'
import StudentEdit from './pages/Student/StudentEdit'

//icons
import { MdDashboard,MdFamilyRestroom  } from "react-icons/md";
import { GrSchedules } from "react-icons/gr";
import { SiGoogleclassroom } from "react-icons/si";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import AdminNav from './pages/AdminNav'
import { AuthContext } from '../../context/AuthContext'
import CreateStudent from './pages/Student/CreateStudent'
import StudentDetail from './pages/Student/StudentDetail'
import CreateFamily from './pages/Family/CreateFamily'
import TeacherDetail from './pages/Teacher/TeacherDetail'
import FamilyDetail from './pages/Family/FamilyDetail'
import FamilyEdit from './pages/Family/FamilyEdit'
import CreateSectionSubject from './pages/Grade/CreateSectionSubject'
import Subject from './pages/Subject'
import SectionCardDetail from './pages/Grade/SectionCardDetail'
import MarkList from '../UI/MarkList'


function Admin({year}) {
  const [searchParams] = useSearchParams()
  const [loading,setLoading] = useState(false)
  const {loggedUser} = useContext(AuthContext)

  const { type: filterType, sectionId, studentId, subjectId,teacherId, idForDetail, familyId, Id,family } = Object.fromEntries([...searchParams]);
  const edit = searchParams.get('action')
  const stuEdit = searchParams.get('action')

  useEffect(()=>{
    try {
      setLoading(true)
      if(loggedUser){
        setLoading(false)
      }
    }finally{
      setLoading(false)
    }
    
  },[loggedUser]);

  const renderPages = (filterType) => {
    switch (filterType) {
      case 'home':
        return <Main />;
      case 'student':
        if (studentId) {
          return <StudentDetail studentId={studentId} />;
        }
        if (stuEdit) {
          return <StudentEdit studentId={stuEdit} />;
        }
        return <Student />;
      case 'grade':
        return <Grade />;
      case 'schedule':
        return <Schedule />;
      case 'subject':
        return <Subject />;
      case 'parent':
        if (familyId) {
          return <FamilyDetail familyId={familyId} />;
        }
        if (edit) {
          return <FamilyEdit familyId={edit} />;
        }
        return <Family />;
      case 'teacher':
        if (teacherId) {
          return <TeacherDetail teacherId={teacherId} />;
        }
        if (subjectId) {
          return <MarkList subjectId={subjectId} />;
        }
        if(Id){
          return <CreateSectionSubject teacherId={Id}/>
        }
        if(idForDetail){
          return <SectionCardDetail idForDetail={idForDetail}/>
        }
        return <Teacher />;
      default:
        return <Main  year={year} />;
    }}

  return (
    <>
    {loading ? <p className='loading'>Loading</p>
    :

       <div className={style.dashContainer}>
          <AdminNav filterType={filterType} username={loggedUser.username} />
          <div className={style.dashBox}>
              {/** dashboard navigation */}
              <div className={style.dashNav}>
                  <div className={style.dashNavBarContainer}>
                    <NavLink to={'?type=home'}><span>{<MdDashboard/>}</span><span>Dashboard</span></NavLink>
                    <NavLink to={'?type=student'}><span>{<PiStudent/>}</span><span>Student</span></NavLink>
                    <NavLink to={'?type=teacher'}><span>{<GiTeacher/> }</span><span>Teacher</span></NavLink>
                    <NavLink to={'?type=parent'}><span>{<MdFamilyRestroom/>}</span><span>Student's family</span></NavLink>
                    <NavLink to={'?type=grade'}><span>{<SiGoogleclassroom/>}</span><span>Grade</span></NavLink>
                    <NavLink to={'?type=schedule'}><span>{<GrSchedules/>}</span><span>Schedule</span></NavLink>
                    <NavLink to={'?type=subject'}><span>{<GrSchedules/>}</span><span>Subject</span></NavLink>
                  </div>
              </div>

              <div className={style.dashDisplay}>
                {filterType === 'student' && sectionId ? <CreateStudent sectionId={sectionId} />
                
                : filterType === 'student' && family?<CreateFamily studentId={family}/>
                
                : renderPages(filterType)
                }
              </div>
          </div>
        </div>
    }
    </>
  )
}

export default Admin
