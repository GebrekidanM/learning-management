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
      {student && 
      <div className={style.BoxContainer}>
        <div className={style.basicInfo}>
          <img src={`http://localhost:4000/uploads/${student.studentPhoto}`} alt='hello'/>
          <time>
              {student && format(new Date(student.createdAt), "MMM yyyy dd, HH:mm")}
          </time>
          <div className={style.extraInfo}>
            <h4>{student.first} {student.middle} {student.last}</h4>
            <p>Gendar: {student.gender}</p>
            <p>Age: {student.age}</p>
            <p> Grade: {student.sectionId.gradeId.grade}{student.sectionId.section}</p>
            <p>Acadamic year: {student.sectionId.gradeId.yearId.yearName}</p>
          </div>
        </div>
        <div className={style.basicInfo}>
          <h3>Detail Adress</h3>
          <div className={style.extraInfo}>
              <p><i>Region:</i>   {student.region}</p>
              <p><i>City:</i>     {student.city}</p>
              <p><i>Subcity: </i> {student.subCity}</p>
              <p><i>Wereda:   </i>{student.wereda}</p>
              <p><i>House No: </i>{student.houseNo}</p>
          </div>
          
        </div>
      </div>
      }
    </div>
  )
}

export default StudentDetail
