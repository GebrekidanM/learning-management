import React, { useEffect } from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import style from "./css/pages.module.css"
import CreateTeacher from './create/CreateTeacher'

function Teacher() {
  const [yearId,setYearId] = useState('')
  const [yearError,setYearError] = useState('')

  const [searchParams] = useSearchParams()
  const teachType = searchParams.get('teachType')


//here to pull at the end of the current link
function generateNewSearchParams(key,value) {
  const type = new URLSearchParams(searchParams)
  type.set(key,value)
  return `?${type.toString()}`
}

useEffect(()=>{
  const fetchYear = async ()=>{
    const response = await fetch('http://localhost:4000/class//check-academic-year')
    const json = await response.json()
    if(response.ok){
      setYearId(json)
    }else{
      setYearError(json.error)
    }
  }
  fetchYear()
},[])

  return (
    <div className={style.pageContainer}>
      <div className={style.pagehead}>
        <div className={style.searchCcontainer}>
            <input type="text" className={style.searchInput} placeholder="Search..."/>
            <button className={style.searchButton}> Search </button>
        </div>
        <Link 
            to={generateNewSearchParams('teachType','createTeacher')}  
            className={style.button}>Add new</Link>
      </div>
      <div>
        {
          teachType === 'createTeacher' ? <CreateTeacher yearId={yearId} yearError={yearError}/> :"hello"
        }
      </div>
    </div>
  )
}

export default Teacher
