import React, { useContext } from 'react'
import style from '../../css/Dashbord.module.css'
import { AuthContext } from '../../../context/AuthContext'
import URL from '../../UI/URL'

function Main({year}) {
  const {loggedUser} = useContext(AuthContext)
  return (
    <div>
      {loggedUser.role === 'Admin' && <button className={`button ${style.buttonSetUp}`} onClick={year} >Create New Acadamic Year</button>}
          <div>
            <h3>Welcome {loggedUser.first||loggedUser.familyFirst||loggedUser.username}</h3>
            <div>
              <div className='w-10rem'>
                <img className='w-10rem h-10rem border-circle mt-4' style={{objectFit:'cover'}} src={`${URL()}/uploads/${loggedUser.teacherPhoto}`} alt={"teacher profile"}/>
              </div>
            </div>
          </div>
    </div>
  )
}

export default Main
