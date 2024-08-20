import React from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import style from "./css/pages.module.css"
import GradeSectionSelector from './component/GradeSectionSelector'
import Grade from './create/Grade'

function Student() {

  const [searchParams] = useSearchParams()
  const stuType = searchParams.get('stuType')

//here to pull at the end of the current link
function generateNewSearchParams(key,value) {
  const type = new URLSearchParams(searchParams)
  type.set(key,value)
  return `?${type.toString()}`
}
  return (
    <div className={style.pageContainer}>
      <div className={style.pagehead}>
        <div className={style.searchCcontainer}>
            <input type="text" className={style.searchInput} placeholder="Search..."/>
            <button className={style.searchButton}> Search </button>
        </div>
        <Link 
            to={generateNewSearchParams('stuType','createStudent')}  
            className={style.button}>Add new</Link>
      </div>
      <div>
        {stuType === 'createStudent' ?
            <GradeSectionSelector/>
          : <Grade/>
        }
      </div>
    </div>
  )
}

export default Student
