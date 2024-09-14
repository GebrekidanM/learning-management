import React, { useContext } from 'react'
import style from '../../css/Dashbord.module.css'
import { AuthContext } from '../../../context/AuthContext'
import URL from '../../UI/URL'

function Main({year}) {
  const {loggedUser} = useContext(AuthContext)
  return (
    <div>
      {loggedUser.role === 'Admin' && <button className={`button ${style.buttonSetUp}`} onClick={year} >Create New Acadamic Year</button>}
      <div className='mt-3 h-16rem flex align-items-center'>
        <div className='w-16rem h-16rem bg-white z-3 flex flex-column gap-3 align-items-center border-round-sm shadow-3'>
            <img className='w-10rem h-10rem border-circle mt-2' style={{objectFit:'cover'}} src={`${URL()}/uploads/${loggedUser.teacherPhoto}`} alt={"teacher profile"}/>
            <h4 className='px-2'>{loggedUser.role} {loggedUser.first || loggedUser.familyFirst || loggedUser.username}  {loggedUser.middle}</h4>
            <small>{loggedUser.email} | {loggedUser.phoneNo}</small>
        </div>
        <div className='h-14rem w-26rem bg-white z-2 -ml-2 flex flex-column gap-3 justify-content-center border-round-sm'>
          <h4 className='ml-3'>physical Address</h4>
          <div className='flex flex-column w-10 mx-auto gap-3'>
              <p><b>User Id:</b> {loggedUser.userId}</p>
              <p><b>Sex:</b> {loggedUser.gender}</p> 
              <p><b>Age:</b> {loggedUser.age}</p>
              <p><b>Address:</b> {loggedUser.region}-{loggedUser.city}-{loggedUser.subCity}-{loggedUser.wereda}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
