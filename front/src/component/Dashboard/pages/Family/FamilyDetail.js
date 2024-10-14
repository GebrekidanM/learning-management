import React, { useEffect, useState } from 'react'
import style from '../css/detail.module.css'
import LoadingIndicator from '../../../common/LoadingIndicator'
import ErrorMessage from '../../../common/ErrorMessage'
import URL from '../../../UI/URL'

function FamilyDetail({familyId}) {
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [family,setFamily] = useState('')
    const id = familyId

    useEffect(()=>{
        const fetchFamily = async()=>{
            setLoading(true)
            try {
               const response = await fetch(`${URL()}/family/${id}`)
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
      {family && 
        <div key={family?._id} className={style.BoxContainer}>
          <div className={style.basicInfo}>
            <img src={`${URL()}/uploads/${family?.familyPhoto}`} alt='hello'/>
            <div className={`${style.extraInfo} p-2`}>
              <h5 className='font-bold text-xl py-2'>{family.familyFirst} {family.familyMiddle} {family.familyLast}</h5>
              <p>Phone no: {family.phoneNo}</p>
              <p>Email: {family.familyEmail}</p>
            </div>
          </div>
        </div>    
      }
    </div>
  )
}

export default FamilyDetail
