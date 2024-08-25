import React from 'react'
import style from '../../css/Dashbord.module.css'
import NumberofStudent from './component/component/NumberofStudent'
import StudentChart from './component/component/StudentChart'

function Main({year}) {
  

  return (
    <div>
      <button className={`button ${style.buttonSetUp}`} onClick={year} >Create New Acadamic Year</button>
      <NumberofStudent/>    
    </div>
  )
}

export default Main
