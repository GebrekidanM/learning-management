import React from 'react'
import kidan from "../../asset/kidan.png"

function About() {
  return (
    <div className='p-4'>
    <div className='w-2/4'>
      <p>It is school management website designed and developed by fullstack developer Gebrekidan Mequanint.</p>
      <img href={kidan} alt={"kidan's phot"}/>
    </div>
      <div className='ml-4'>
        <p>It has:</p>
        <ol className='ml-6 list-item'>
            <li>all about students, parents, teachers and admins profile </li>
            <li>Students result of each assesment with the control of teachers.</li>
            <li>Number of students</li>
            <li>Number of class with defined Grade and Section.</li>
            <li>Dashboard for teachers to control students result.</li>
            <li>Dashboard for for students and parents to see exam results.</li>
            <li>Dashboard for Director to register new student, new teacher, new parent and to fire teachers </li>
        </ol>
      </div>
      
        
         
    </div>
  )
}

export default About
