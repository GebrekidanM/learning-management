import React, { useEffect, useState } from 'react'
import style from '../css/detail.module.css'
import {useNavigate } from 'react-router-dom';
import FamilyDetailInfo from '../Family/FamilyDetailInfo';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';
import URL from '../../../UI/URL';


function StudentDetail({studentId}) {
    const [student,setStudent] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [familyLoading,setFamilyLoading] = useState(false)
    const [familyError,setFamilyError] = useState('')
    const [family,setFamily] = useState("")
    const navigate = useNavigate()


    useEffect(()=>{
        const fetchAstudent = async()=>{
            setLoading(true)
            try {
               const response = await fetch(`${URL()}/student/${studentId}`)
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
    },[studentId])

    //fetch family information
    useEffect(()=>{
      const fetchAfamily = async()=>{
        setFamilyLoading(true)
        try {
            const response = await fetch(`${URL()}/family/${studentId}`)
            const json = await response.json()

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
    },[studentId])

    //family one
    const handleFamily = ()=>{
         navigate(`/main?type=student&family=${studentId}`)
    }
    if(loading){
      return <LoadingIndicator/>
    }
    if (error) {
      return <ErrorMessage error={error} />;
    }
    const handleResult = ()=>{
      navigate(`/main?type=student&result=${studentId}`,{state:{first:student.first,last:student.last,middle:student.middle}})
    }

  return student &&(
      <div className={'mt-12 grid grid-cols-4 grid-rows-2 gap-4'}>
        <div className={'bg-gray-400 border-2 row-span-2'}>
          <img src={`${URL()}/uploads/${student.studentPhoto}`} alt='hello'/>
          <div className={'p-2'}>
            <h5 className='font-bold'>{student.first} {student.middle} {student.last}</h5>
            <p>Gendar: {student.gender}</p>
            <p>Age: {student.age}</p>
            <p> Grade: {student.sectionId.gradeId.grade}{student.sectionId.section}</p>
            <p>Acadamic year: {student.sectionId.gradeId.yearId.yearName}</p>
          </div>
          <div className='button mt-3 -mb-2 cursor-pointer' onClick={handleResult} >See Result</div>
        </div>
        <div className={`${style.adressInfo} row-span-1`}>
          <h3 className='font-bold text-lg'>Detail Adress</h3>
          <div className={style.extraInfo}>
              <p><i><b>Region:</b></i> {student.region}</p>
              <p><i><b>City:</b></i> {student.city}</p>
              <p><i><b>Subcity:</b></i> {student.subCity}</p>
              <p><i><b>Wereda:</b></i> {student.wereda}</p>
              <p><i><b>House No:</b></i> {student.houseNo}</p>
          </div>
        </div>
        <div className='flex flex-col justify-center gap-4'>
          {familyLoading && <LoadingIndicator/>}

          {family.length > 0 
          ? 
            family.length > 1 ?
            family.map((fam)=>(
                <FamilyDetailInfo  style={style} student={student} fam={fam}/>
              ))
              :
              (<>
                {family.map((fam)=>(
                  <FamilyDetailInfo style={style} student={student} fam={fam}/>
                ))
                }
                <div className={style.addFamily}>
                  <div className={style.familyCreateBox}>
                      <div className={'button'} onClick={handleFamily}>Add Family 2</div>
                      <div></div>
                  </div>
                </div>
              </>
              )
          :
              <div className={style.addFamily}>
                <div className={style.familyCreateBox}>
                    <div className={'button cursor-pointer bg-white border-2 border-cyan-900 hover:bg-cyan-900 hover:text-white'} onClick={handleFamily}>Add Family 1</div>
                    {familyError && <ErrorMessage error={familyError}/>}
                </div>
              </div>
          }
        </div>
      </div>
  )
}

export default StudentDetail
