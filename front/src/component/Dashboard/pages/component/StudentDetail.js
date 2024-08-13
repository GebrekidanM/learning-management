import React, { useEffect, useState } from 'react'
import style from './css/detail.module.css'
import {format } from "date-fns";

function StudentDetail({studentId}) {
    const [student,setStudent] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [familyLoading,setFamilyLoading] = useState(false)
    const [familyError,setFamilyError] = useState('')
    const [family,setFamily] = useState('')

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

    //fetch family information
    useEffect(()=>{
      const fetchAfamily = async()=>{
        setFamilyLoading(true)
        try {
            const response = await fetch(`http://localhost:4000/member/family/${studentId}`)
            const json = response.json()
            if(response.ok){
              setFamily(json.family)
            }else{
              setFamilyError(json.error)
            }
        } catch (error) {
          setFamilyError(error)
        }finally{
          setFamilyLoading(false)
        }
        
      }
      fetchAfamily()
    },[])

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className='error'>{error}</p>}
      {student && 
      <div className={style.BoxContainer}>
        <div className={style.basicInfo}>
          <img src={`http://localhost:4000/uploads/${student.studentPhoto}`} alt='hello'/>
          <time>
              {student && format(new Date(student.createdAt), "MMM yyyy dd, HH:mm")}
          </time>
          <div className={style.extraInfo}>
            <h5>{student.first} {student.middle} {student.last}</h5>
            <p>Gendar: {student.gender}</p>
            <p>Age: {student.age}</p>
            <p> Grade: {student.sectionId.gradeId.grade}{student.sectionId.section}</p>
            <p>Acadamic year: {student.sectionId.gradeId.yearId.yearName}</p>
          </div>
        </div>
        <div className={style.basicInfo}>
          <h3>Detail Adress</h3>
          <div className={style.extraInfo}>
              <p><i>Region:</i> {student.region}</p>
              <p><i>City:</i> {student.city}</p>
              <p><i>Subcity:</i> {student.subCity}</p>
              <p><i>Wereda:</i> {student.wereda}</p>
              <p><i>House No:</i> {student.houseNo}</p>
          </div>
        </div>
        <div className={style.basicInfo}>
          {familyError && <p className={'error'}>{familyError}</p>}
          {family 
          ? 
            <p>family</p> 
          :
            <div className={style.familyCreateBox}>
                <div className={'button'}>Add Family 1</div>
                <div></div>

            </div>
          }
        </div>
        <div className={style.basicInfo}>
          {familyError && <p className={'error'}>{familyError}</p>}
          {family 
          ? 
            <p>family</p> 
          :
            <div className={style.familyCreateBox}>
                <div className={'button'}>Add Family 2</div>
                <div></div>

            </div>
          }
        </div>
      </div>
      }
    </div>
  )
}

export default StudentDetail
