import React, { useEffect, useState } from 'react'
import style from '../css/Edit.module.css'


import { LiaUserEditSolid } from "react-icons/lia";
import { RiEdit2Fill } from "react-icons/ri";


function FamilyEdit({familyId}) {
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [family,setFamily] = useState("")
    const id = familyId

    useEffect(()=>{
        const fetchFamily = async()=>{
            setLoading(true)
            try {
               const response = await fetch(`http://localhost:4000/member/family/own/${id}`)
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
    },[])

  return (
    <div className={style.container}>

      {loading && <p>Loading...</p>}

      {error && <p className='error'>{error}</p>}
      
      {family && family.map(family=>(
          <div className={style.basicInfo}>
            <span>
              <img src={`http://localhost:4000/uploads/${family?.familyPhoto}`} alt='hello'/>
              <span className={style.clickEdit}>{<LiaUserEditSolid/>}</span>
            </span>
            <div className={style.extraInfo}>
              <div className={style.name}>
                <h5> {family.familyFirst} {family.familyMiddle} {family.familyLast}</h5> <span className={style.clickEdit}>{<RiEdit2Fill/>}</span>
              </div>
              <div className={style.name}>
                <p>Family type: {family.familyType}</p> <span className={style.clickEdit}>{<RiEdit2Fill/>}</span>
              </div>
              <div className={style.name}>
                <p>Phone no: {family.familyPhone}</p> <span className={style.clickEdit}>{<RiEdit2Fill/>}</span>
              </div>
              <div className={style.name}>
                <p>Email: {family.familyEmail}</p> <span className={style.clickEdit}>{<RiEdit2Fill/>}</span>
              </div>
            </div>
          </div>
      ))
      
      }
    </div>
  )
}

export default FamilyEdit
