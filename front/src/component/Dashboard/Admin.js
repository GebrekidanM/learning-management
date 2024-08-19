import React, { useContext} from 'react'
import style from "../css/Dashbord.module.css"
import {useSearchParams, NavLink} from 'react-router-dom' 
import Main from './pages/Main'
import Student from './pages/Student'
import Schedule from './pages/Schedule'
import Family from './pages/Family'
import Teacher from './pages/Teacher'
import Grade from './pages/Grade'

//icons
import { MdDashboard,MdFamilyRestroom  } from "react-icons/md";
import { GrSchedules } from "react-icons/gr";
import { SiGoogleclassroom } from "react-icons/si";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import AdminNav from './pages/AdminNav'
import { AuthContext } from '../../context/AuthContext'
import CreateStudent from './pages/create/CreateStudent'
import StudentDetail from './pages/component/StudentDetail'
import CreateFamily from './pages/create/CreateFamily'
import TeacherDetail from './pages/component/TeacherDetail'
import FamilyDetail from './pages/component/FamilyDetail'
import FamilyEdit from './pages/component/edit/FamilyEdit'

function Admin() {
  const [searchParams] = useSearchParams()
  const {loggedUser} = useContext(AuthContext)  
  const filterType = searchParams.get('type')
  const sectionId = searchParams.get('sectionId')
  const studentId = searchParams.get('studentId')
  const teacherId = searchParams.get('teacherId')
  const familyId = searchParams.get('familyId')
  const family = searchParams.get('family')
  const edit = searchParams.get('action')

  const renderPages = (filterType) => {
    switch (filterType) {
      case 'home':
        return <Main />;
      case 'student':
        if (studentId) {
          return <StudentDetail studentId={studentId} />;
        }
        return <Student />;
      case 'grade':
        return <Grade />;
      case 'schedule':
        return <Schedule />;
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
        return <Teacher />;
      default:
        return <Main/>;
    }}

  return (
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
  )
}

export default Admin
