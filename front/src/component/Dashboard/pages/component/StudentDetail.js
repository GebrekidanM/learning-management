import React, { useEffect, useState } from 'react'
import style from './css/detail.module.css'

function StudentDetail({studentId}) {
    const [student,setStudent] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        const fetchAstudent = async()=>{
            setLoading(true)
            try {
               const response = await fetch(`http://localhost:4000/member/${studentId}`)
               console.log(response)

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
      <div className={style.bsicInfo}>
        <h4>{student.first} {student.middle} {student.last}</h4>
        <p>{}</p>
      </div>

    </div>
  )
}

export default StudentDetail
