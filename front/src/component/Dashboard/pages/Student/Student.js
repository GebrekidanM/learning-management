import React from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import style from "../css/pages.module.css"
import GradeSectionSelector from '../Grade/GradeSectionSelector'
import Grade from '../Grade/Grade'

function Student({semesterId}) {

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
            className={'button bg-white text-cyan-900 w-3 border-cyan-900 border-1'}>Add new student</Link>
      </div>
      <div>
        {stuType === 'createStudent' ?
            <GradeSectionSelector semesterId={semesterId}/>
          : <Grade/>
        }
      </div>
    </div>
  )
}

export default Student
