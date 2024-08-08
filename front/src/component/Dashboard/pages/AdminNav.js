import React from 'react'
import style from '../../css/Dashbord.module.css'

function AdminNav({username}) {
  return (
    <div className={style.adminNav}>
      <div className={style.username}>
          Welcome {username}
      </div>


    </div>
  )
}

export default AdminNav
