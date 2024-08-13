import React, { useEffect, useState } from 'react'
import style from './css/detail.module.css'
import {format } from "date-fns";

function StudentDetail({studentId}) {
    const [student,setStudent] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        const fetchAstudent = async()=>{
            setLoading(true)
            try {
               const response = await fetch(`http://localhost:4000/member/${studentId}`)
               const json = await response.json()
               if(response.ok){
                  setStudent(json.student)
               }else{
                setError(json.error)
               }
            } catch (error) {
                setError(error)
            }finally {
                setLoading(false);
            }            
        }
        fetchAstudent() 
    },[])

  return (
    <div>
      {loading && <p>Loading...</p>}
      <div className={style.basicInfo}>
        <div>
          {student && <img src={`http://localhost:4000/${student.studentPhoto}`} alt='hello'/>}
          
        </div>
        <time>
            {student && format(new Date(student.createdAt), "MMM yyyy dd, HH:mm")}
        </time>
        <h4>{student.first} {student.middle} {student.last}</h4>
        <p>{}</p>
      </div>

    </div>
  )
}

export default StudentDetail
