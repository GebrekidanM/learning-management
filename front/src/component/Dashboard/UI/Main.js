import React, { useContext, useState } from 'react'
import style from '../../css/Dashbord.module.css'
import { AuthContext } from '../../../context/AuthContext'
import URL from '../../UI/URL'
import { IoSettingsSharp } from "react-icons/io5";
import PasswordChange from './Password';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Main({year}) {
  const {loggedUser} = useContext(AuthContext)
  const [handle,setHandle] = useState(false)

  const handlePassword = ()=>{
    setHandle(prev=>!prev)
  }
  return loggedUser && (
    <div>
    <ToastContainer/>
      {loggedUser.role === 'Admin' && <button className={`button ${style.buttonSetUp}`} onClick={year} >Create New Acadamic Year</button>}
      <div className='mt-3 h-16rem flex align-items-center'>
        <div className='w-16rem h-16rem bg-white z-2 flex flex-column gap-3 align-items-center border-round-sm shadow-3'>
            <img className='w-10rem h-10rem border-circle mt-2' style={{objectFit:'cover'}} src={`${URL()}/uploads/${loggedUser.teacherPhoto}`} alt={"teacher profile"}/>
            <h4 className='px-2'>{loggedUser.role} {loggedUser.first || loggedUser.familyFirst || loggedUser.username}  {loggedUser.middle}</h4>
            <small>{loggedUser.email} | {loggedUser.phoneNo}</small>
        </div>
        <div className='h-15rem w-26rem bg-white z-1 -ml-2 flex flex-column gap-3 justify-content-center border-round-sm'>
          <h4 className='ml-3'>physical Address</h4>
          <div className='flex flex-column w-10 mx-auto gap-3'>
              <p><b>User Id:</b> {loggedUser.userId}</p>
              <p><b>Sex:</b> {loggedUser.gender}</p> 
              <p><b>Age:</b> {loggedUser.age}</p>
              <p><b>Address:</b> {loggedUser.region}-{loggedUser.city}-{loggedUser.subCity}-{loggedUser.wereda}</p>
          </div>
        </div>
      </div>
      <div className='p-2 bg-white mt-3 w-16rem border-round-sm shadow-3'>
        <h4 className='flex gap-1 align-items-center w-6rem'>{<IoSettingsSharp/>} Setting </h4>
        <div className='w-10 mx-auto flex flex-column gap-2 mt-3'>
          <p onClick={handlePassword} className='p-2 text-cyan-900 border-round-xs hover:bg-white font-semibold cursor-pointer  transition-duration-500' style={{backgroundColor:"#010e134d"}}>Change password</p>
          <p className='p-2 text-cyan-900 border-round-xs font-semibold hover:bg-white  cursor-pointer  transition-duration-500' style={{backgroundColor:"#010e134d"}}>Change phone number</p>
        </div>
      </div>
      {handle && <PasswordChange handle={handle} setHandle={setHandle}/>}
    </div>
  )
}

export default Main
