import React, { useEffect, useState } from 'react'
import style from '../css/detail.module.css'
import LoadingIndicator from '../../../common/LoadingIndicator'
import ErrorMessage from '../../../common/ErrorMessage'
import URL from '../../../UI/URL'

function FamilyDetail({familyId}) {
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [family,setFamily] = useState("")
    const id = familyId

    useEffect(()=>{
        const fetchFamily = async()=>{
            setLoading(true)
            try {
               const response = await fetch(`${URL()}/family/own/${id}`)
               const json = await response.json()
               if(response.ok){
                 return setFamily(json)
               }else{
                setError(json.error)
               }
            } catch (error) {
                setError(error)
            }finally {
                setLoading(false);
            }            
        }
        fetchFamily() 
    },[id])
    
  return (
    <div>
      {loading && <LoadingIndicator/>}
      {error && <ErrorMessage error={error}/>}
      {family && family.map(family=>(
        <div key={family?._id} className={style.BoxContainer}>
          <div className={style.basicInfo}>
            <img src={`${URL()}/uploads/${family?.familyPhoto}`} alt='hello'/>
            <div className={style.extraInfo}>
              <h5>{family.familyFirst} {family.familyMiddle} {family.familyLast}</h5>
              <p>Family type: {family.familyType}</p>
              <p>Phone no: {family.familyPhone}</p>
              <p>Email: {family.familyEmail}</p>
            </div>
          </div>
          <div className={style.basicInfo}>
            <h5>Adress</h5>
            <p>Region: {family.studentId.region}</p>
            <p>City: {family.studentId.city}</p>
            <p>Subcity: {family.studentId.subCity}</p>
            <p>Wereda: {family.studentId.wereda}</p>
            <p>House No: {family.studentId.houseNo}</p>
          </div>
        </div>
      ))
      
      }
    </div>
  )
}

export default FamilyDetail
