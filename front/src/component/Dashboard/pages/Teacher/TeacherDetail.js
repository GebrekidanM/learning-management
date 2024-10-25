import React, { useContext, useEffect, useState } from 'react'
import style from '../css/detail.module.css'
import SectionCard from '../Grade/SectionCard'
import css from '../css/SectionCard.module.css'
import LoadingIndicator from '../../../common/LoadingIndicator'
import URL from '../../../UI/URL'
import { Link } from 'react-router-dom'
import ErrorMessage from '../../../common/ErrorMessage'
import { AuthContext } from '../../../../context/AuthContext'
import UpdateTeacherSubject from './UpdateTeacherSubject'

function TeacherDetail({teacherId,yearId}) {
  const [sectionInfos,setSectionInfos] = useState([])
  const [errorInfo,setErrorInfo] = useState('')
    const [loadingInfo,setLoadingInfo] = useState(false)
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [teacher,setTeacher] = useState("")
    const {loggedUser} = useContext(AuthContext)
    const [toggle,setToggle] = useState(false)

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
                setErrorInfo(error.message || 'No info');
            } finally {
                setLoadingInfo(false);
            }
        };

        if (loggedUser?.role === "Admin" || loggedUser?.role === "Editor") {
            fetchTeacherSections();
        }
    }, [teacherId,loggedUser,toggle]);
    if(loading){
      return <LoadingIndicator/>
    }

  return (loggedUser?.role === "Admin" || loggedUser?.role === "Editor") &&(
    <>
      
      {error && <ErrorMessage error={error}/>}
      {teacher && 
      <div className={'flex  justify-between mt-4 items-start'}>
        <div className={style.basicInfo}>
          <img src={`${URL()}/uploads/${teacher.teacherPhoto}`} alt='hello'/>
          <div className={` flex flex-column gap-3 ml-3 mt-3w-full`}>
            <h5 className='text-align'>{teacher.first} {teacher.middle} {teacher.last}</h5>
            <p className='text-left'>Gendar: {teacher.gender}</p>
            <p className='text-left'>Age: {teacher.age}</p>
            <p className='text-left'>Acadamic year: {teacher.yearId.yearName}</p>
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
        <div className='mt-3'>
          {loadingInfo ? <LoadingIndicator/>
          :
          <div className='flex flex-col gap-4'>
            {teacher.active && <Link className='button' to={`/main?type=teacher&Id=${teacherId}`}>Add Section</Link>}      
                {errorInfo ? 
                  <div className='mt-4'>
                    <ErrorMessage error={error}/>
                  </div>
                  :
                    <div className={`${css.sectionCardContaine} flex flex-column gap-3 mt-4 w-15rem`}>
                        {sectionInfos && sectionInfos.map(sectionInfo=>(
                            <SectionCard key={sectionInfo._id} teacherId={teacherId} role="" sectionInfo={sectionInfo}/>
                        ))}
                    </div>
                }            
          </div>
          }
        </div>
        {teacher.active && 
        <div>
          {loadingInfo ? 
            <LoadingIndicator/>
          :
            errorInfo ? <ErrorMessage error={error}/>
              :
            <UpdateTeacherSubject yearId={yearId} teacherId={teacherId} setToggle={setToggle}/>
          }
        </div>}     
      </div>
      }
    </>
  )
}

export default TeacherDetail
