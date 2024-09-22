import React, { useEffect, useState } from 'react'
import style from '../css/detail.module.css'
import SectionCard from '../Grade/SectionCard'
import css from '../css/SectionCard.module.css'
import LoadingIndicator from '../../../common/LoadingIndicator'
import URL from '../../../UI/URL'
import { Link } from 'react-router-dom'
import ErrorMessage from '../../../common/ErrorMessage'

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
               const response = await fetch(`${URL()}/teacher/${teacherId}`)
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
                const response = await fetch(`${URL()}/medium/teacher/section/${teacherId}`);
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
    if(loading){
      return <LoadingIndicator/>
    }

  return (
    <div>
      
      {error && <p className='error'>{error}</p>}
      {teacher && 
      <div className={style.BoxContainer}>
        <div className={style.basicInfo}>
          <img src={`${URL()}/uploads/${teacher.teacherPhoto}`} alt='hello'/>
          <div className={`text-left flex flex-column gap-3 ml-3 mt-3`}>
            <h5>{teacher.first} {teacher.middle} {teacher.last}</h5>
            <p>Gendar: {teacher.gender}</p>
            <p>Age: {teacher.age}</p>
            <p>Acadamic year: {teacher.yearId.yearName}</p>
          </div>
        </div>
        <div className={style.adressInfo}>
          <h3>Detail Adress</h3>
          <div className={`text-left flex flex-column gap-3`}>
              <p><i><b>Region:</b></i> {teacher.region}</p>
              <p><i><b>City:</b></i> {teacher.city}</p>
              <p><i><b>Subcity:</b></i> {teacher.subCity}</p>
              <p><i><b>Wereda:</b></i> {teacher.wereda}</p>
              <p><i><b>House No:</b></i> {teacher.houseNo}</p>
          </div>
        </div>   
        <div>
          {loadingInfo ? <LoadingIndicator/>
          :
          <div className={css.MainBox}>  
          <Link className='button' to={`/main?type=teacher&Id=${teacherId}`}>Add Section</Link>      
                {errorInfo ? <ErrorMessage error={error}/>
                  :
                    <div className={css.sectionCardContainer}>
                        {sectionInfos && sectionInfos.map(sectionInfo=>(
                            <SectionCard key={sectionInfo._id} teacherId={teacherId} role="" sectionInfo={sectionInfo}/>
                        ))}
                    </div>
                }            
          </div>
          }
        </div> 
        <div>
          
        </div>    
      </div>
      }
    </div>
  )
}

export default TeacherDetail
