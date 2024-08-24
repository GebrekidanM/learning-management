import React, { useState } from 'react'
import { MultiSelect } from 'primereact/multiselect';
import style from './css/pages.module.css';

const subjects = [
    {name:"አማርኛ"},
    {name:"ሒሳብ"},
    {name:"አካባቢ ሳይንስ"},
    {name:"የክወና እና እይታ ጥበብ"},
    {name:"የሥነ ጥበባት ትምህርት"},
    {name:"ጤሰማ"},
    {name:"ስነ ምግባር"},
    {name:"ኅብረተሰብ"},
    {name:"English"},
    {name:"Spoken"},
    {name:"Grammer"},
    {name:"Communication"},
    {name:"Mathematics"},
    {name:"General Science"},
    {name:"Social Study"},
    {name:"PVA"},
    {name:"HPE"}
  ]

function Subject() {
    const [subject,setSubject] = useState('')

    console.log(subject)

  return (
    <div className={`card flex justify-content-center ${style.subjectContainer}`}>
        <form className={style.subjectBox}>
            <label>Subjects:</label>
            <MultiSelect value={subject} onChange={(e) => setSubject(e.value)} options={subjects} optionLabel="name" display="chip" 
                placeholder="Select Subjects" maxSelectedLabels={3} className="w-full md:w-20rem" />
                <button type='submit' className={`button ${style.buttonSubject}`}>Submit</button>
        </form>
    </div>
  )
}

export default Subject
