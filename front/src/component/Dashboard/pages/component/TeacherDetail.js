import React, { useEffect, useState } from 'react'
import style from './css/detail.module.css'
import {format } from "date-fns";
import {useNavigate } from 'react-router-dom';

function TeacherDetail({studentId}) {
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [teacher,setTeacher] = useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchTeacher = async()=>{
            setLoading(true)
            try {
               const response = await fetch(`http://localhost:4000/member/teacher/${studentId}`)
               const json = await response.json()

               if(response.ok){
                  setTeacher(json)
               }else{
                setError(json.error)
               }
            } catch (error) {
                setError(error)
            }finally {
                setLoading(false);
            }            
        }
        fetchTeacher() 
    },[])
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className='error'>{error}</p>}
      {teacher && 
      <div className={style.BoxContainer}>
        <div className={style.basicInfo}>
          <img src={`http://localhost:4000/uploads/${teacher.teacherPhoto}`} alt='hello'/>
          <time>
              {teacher && format(new Date(teacher.createdAt), "MMM yyyy dd, HH:mm")}
          </time>
          <div className={style.extraInfo}>
            <h5>{teacher.first} {teacher.middle} {teacher.last}</h5>
            <p>Gendar: {teacher.gender}</p>
            <p>Age: {teacher.age}</p>
            <p>Acadamic year: {teacher.yearId.yearName}</p>
          </div>
        </div>
        <div className={style.adressInfo}>
          <h3>Detail Adress</h3>
          <div className={style.extraInfo}>
              <p><i><b>Region:</b></i> {teacher.region}</p>
              <p><i><b>City:</b></i> {teacher.city}</p>
              <p><i><b>Subcity:</b></i> {teacher.subCity}</p>
              <p><i><b>Wereda:</b></i> {teacher.wereda}</p>
              <p><i><b>House No:</b></i> {teacher.houseNo}</p>
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default TeacherDetail
