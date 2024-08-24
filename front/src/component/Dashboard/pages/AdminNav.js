import React from 'react'
import style from '../../css/Dashbord.module.css'

function AdminNav({username,filterType}) {
  return (
    <div className={style.adminNav}>
      <div className={style.username}>
        {filterType? <h1>{filterType}</h1> : <>Welcome {username}</> }
      </div>
    </div>
  )
}

export default AdminNav
