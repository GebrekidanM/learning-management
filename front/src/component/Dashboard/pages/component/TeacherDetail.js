import React, { useEffect, useState } from 'react'
import style from './css/detail.module.css'
import { Link } from 'react-router-dom'
import SectionCard from './component/SectionCard'
import css from './css/SectionCard.module.css'

function TeacherDetail({teacherId}) {
  const [sectionInfos,setSectionInfos] = useState([])
  const [errorInfo,setErrorInfo] = useState('')
    const [loadingInfo,setLoadingInfo] = useState(false)
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [teacher,setTeacher] = useState("")

    useEffect(()=>{
        const fetchTeacher = async()=>{
            setLoading(true)
            try {
               const response = await fetch(`http://localhost:4000/member/teacher/${teacherId}`)
               const json = await response.json()
               if(response.ok){
                 return setTeacher(json)
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
    },[teacherId])

   useEffect(() => {
        const fetchTeacherSections = async () => {
            setLoadingInfo(true);
            try {
                const response = await fetch(`http://localhost:4000/medium/teacher/section/${teacherId}`);
                const json = await response.json();
                if (response.ok) {
                    setSectionInfos(json);
                } else {
                    setErrorInfo(json.error || 'Failed to fetch sections');
                }
            } catch (error) {
                setErrorInfo(error.message);
            } finally {
                setLoadingInfo(false);
            }
        };

        if (teacherId) {
            fetchTeacherSections();
        }
    }, [teacherId]);
    
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className='error'>{error}</p>}
      {teacher && 
      <div className={style.BoxContainer}>
        <div className={style.basicInfo}>
          <img src={`http://localhost:4000/uploads/${teacher.teacherPhoto}`} alt='hello'/>
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
        <div>
          {loadingInfo ? <p>Loading</p>
          :
          <div className={css.MainBox}>
              <Link className='button' to={`/main?type=teacher&Id=${teacherId}`}>Add Section</Link>
              {errorInfo ? <p className='error'>{errorInfo}</p>
                :
                  <div className={css.sectionCardContainer}>
                      {sectionInfos && sectionInfos.map(sectionInfo=>(
                          <SectionCard key={sectionInfo._id} teacherId={teacherId}  sectionInfo={sectionInfo}/>
                      ))}
                  </div>
              }
          </div>
          }
        </div>     
      </div>
      }
    </div>
  )
}

export default TeacherDetail
