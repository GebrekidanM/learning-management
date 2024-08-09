import React, { useContext, useEffect } from 'react'
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

function Admin() {
  const [searchParams] = useSearchParams()
  const {loggedUser} = useContext(AuthContext)  
  const filterType = searchParams.get('type')
  
  const renderPages = (filterType) => {
    switch (filterType) {
      case 'home':
        return <Main />;
      case 'student':
        return <Student />;
      case 'grade':
        return <Grade />;
      case 'schedule':
        return <Schedule />;
      case 'parent':
        return <Family />;
      case 'teacher':
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
            {renderPages(filterType)}            
          </div>
      </div>
    </div>
  )
}

export default Admin
