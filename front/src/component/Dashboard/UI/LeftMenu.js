import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MdDashboard, MdFamilyRestroom ,MdMapsHomeWork} from "react-icons/md";
import { SiTestcafe, SiGoogleclassroom } from "react-icons/si";
import { GrSchedules } from "react-icons/gr";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import URL from '../../UI/URL';
import avatar from '../../../asset/admin.jpg';
import { AuthContext } from '../../../context/AuthContext';

function LeftMenu({ filterType }) {
    const { loggedUser } = useContext(AuthContext);
    
    const adminPhoto = URL() + `/uploads/${loggedUser?.teacherPhoto || loggedUser?.familyPhoto || loggedUser?.studentPhoto}`;
    return loggedUser && (
        <div className='w-10rem flex justify-content-center' style={{ backgroundColor: "var(--card)", minHeight: "calc(100vh - 4rem)", maxHeight: "calc(100vh - 4rem)", position: "sticky", top: "4rem" }}>
            <div className='flex flex-column gap-3'>
                <div className='w-5rem'>
                    <Link to={'?type=profile'}>
                        <img className='w-5rem h-5rem border-circle mt-4'
                            style={{ objectFit: 'cover' }} 
                            src={adminPhoto ? adminPhoto : avatar} 
                            alt={`${loggedUser.role} profile`} 
                            onError={(e) => e.target.src = avatar}
                        />
                    </Link>
                </div>
                <NavLink to={'?type=home'} className={`${filterType === 'home' ? 'text-yellow-500 font-bold' : 'text-white'} flex align-items-center gap-2 hover:text-yellow-500 transition-duration-500`}>
                    <span>{<MdDashboard />}</span><span>Dashboard</span>
                </NavLink>
                
                {loggedUser.role === "Teacher" && (
                    <>
                        <NavLink to={'?type=class'} className={`${filterType === 'class' ? 'text-yellow-500 font-bold' : 'text-white'} flex align-items-center gap-2 hover:text-yellow-500 transition-duration-500`}>
                            <span>{<SiGoogleclassroom />}</span><span>Class</span>
                        </NavLink>
                        <NavLink to={'?type=homeclass'} className={`${filterType === 'homeclass' ? 'text-yellow-500 font-bold' : 'text-white'} flex align-items-center gap-2 hover:text-yellow-500 transition-duration-500`}>
                            <span>{<MdMapsHomeWork />}</span><span>Home Class</span>
                        </NavLink>
                    </>
                )}

                {(loggedUser?.role === "Admin" || loggedUser?.role === "Editor") && (
                    <>
                        <NavLink to={'?type=student'} className={`${filterType === 'student' ? 'text-yellow-500 font-bold' : 'text-white'} flex align-items-center gap-2 hover:text-yellow-500 transition-duration-500`}>
                            <span>{<PiStudent />}</span><span>Student</span>
                        </NavLink>
                        <NavLink to={'?type=teacher'} className={`${filterType === 'teacher' ? 'text-yellow-500 font-bold' : 'text-white'} flex align-items-center gap-2 hover:text-yellow-500 transition-duration-500`}>
                            <span>{<GiTeacher />}</span><span>Teacher</span>
                        </NavLink>
                        <NavLink to={'?type=parent'} className={`${filterType === 'parent' ? 'text-yellow-500 font-bold' : 'text-white'} flex align-items-center gap-2 hover:text-yellow-500 transition-duration-500`}>
                            <span>{<MdFamilyRestroom />}</span><span>Family</span>
                        </NavLink>
                        <NavLink to={'?type=grade'} className={`${filterType === 'grade' ? 'text-yellow-500 font-bold' : 'text-white'} flex align-items-center gap-2 hover:text-yellow-500 transition-duration-500`}>
                            <span>{<SiGoogleclassroom />}</span><span>Grade</span>
                        </NavLink>
                        <NavLink to={'?type=subject'} className={`${filterType === 'subject' ? 'text-yellow-500 font-bold' : 'text-white'} flex align-items-center gap-2 hover:text-yellow-500 transition-duration-500`}>
                            <span>{<GrSchedules />}</span><span>Subject</span>
                        </NavLink>
                    </>
                )}

                {(loggedUser.role === "Student" || loggedUser.role === "Family") && (
                    <NavLink to={'?type=score'} className={`${filterType === 'score' ? 'text-yellow-500 font-bold' : 'text-white'} flex align-items-center gap-2 hover:text-yellow-500 transition-duration-500`}>
                        <span>{<SiTestcafe />}</span><span>Score</span>
                    </NavLink>
                )}

                <NavLink to={'?type=schedule'} className={`${filterType === 'schedule' ? 'text-yellow-500 font-bold' : 'text-white'} flex align-items-center gap-2 hover:text-yellow-500 transition-duration-500`}>
                    <span>{<GrSchedules />}</span><span>Schedule</span>
                </NavLink>
            </div>
        </div>
    );
}

export default LeftMenu;
