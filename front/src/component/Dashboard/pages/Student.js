import React from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import style from "./css/pages.module.css"
import Grade from './create/Grade'
import CreateStudent from './create/CreateStudent'


const grades = [
  {grade:1,Male:17,Female:15},
  {grade:2,Male:15,Female:20},
  {grade:3,Male:10,Female:25},
  {grade:4,Male:10,Female:15},
  {grade:5,Male:17,Female:10},
  {grade:6,Male:15,Female:15},
  {grade:7,Male:17,Female:17},
  {grade:8,Male:15,Female:11}
]


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
        {stuType == 'createStudent' ?
            <CreateStudent/>
          : <>{grades.map((clas)=>
               <Grade grade={clas.grade} Male={clas.Male} Female={clas.Female}/>
              )}
            </>
      }
      </div>
    </div>
  )
}

export default Student
