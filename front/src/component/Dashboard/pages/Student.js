import React from 'react'
import {Link} from 'react-router-dom'
import style from "./css/pages.module.css"

function Student() {
  return (
    <div className={style.pageBox}>
      <div className={style.search_container}>
          <input type="text" className={style.search_input} placeholder="Search..."/>
          <button className={style.search_button}>
            Search
          </button>
        </div>
        <Link to={'/createSteudent'}>Add new</Link>
    </div>
  )
}

export default Student
