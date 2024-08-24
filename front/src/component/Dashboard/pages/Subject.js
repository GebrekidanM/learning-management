import React, { useState } from 'react'
import style from './css/pages.module.css';


function Subject() {
    const [subject,setSubject] = useState('')

  return (
    <div className={`card flex justify-content-center ${style.subjectContainer}`}>
        
    </div>
  )
}

export default Subject
