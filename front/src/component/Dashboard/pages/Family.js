import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import style from "./css/pages.module.css"

const Family = () => {
  const [error,setError] = useState('')
  const [loading,setLoading] = useState('')
  const [families,setFamilies] = useState('')

useEffect(()=>{
  const fetchFamily = async ()=>{
    try {
      setLoading(true)
        const response = await fetch('http://localhost:4000/member/families')
        const json = await response.json()
        if(response.ok){
          setFamilies(json)
        }else{
          setError(json.error)
        }
      } catch (error) {
        setError(error.message)
      }finally{
        setLoading(false)
      }
    }
    fetchFamily()
  },[])




  return (
    <div className={style.pageContainer}>
              {loading && <p>loading</p>}

              <table style={{marginTop:"2rem"}}>
                <tr>
                  <th> No </th>
                  <th> Family Name </th>
                  <th> Student Name </th>
                  <th>Family Type</th>
                  <th colSpan={"3"}> Action</th>
                </tr>
              {error && <p className='error'>{error}</p>}
                
                {families.length > 0 && families.map((family,index)=>(
                  <tr key={family._id}>
                    <td>{index + 1}</td>
                    <td>{family.familyFirst} {family.familyMiddle}</td>
                    <td>{family.studentId.first} {family.studentId.middle}</td>
                    <td>{family.familyType}</td>
                    <td className={'delete'}>Delete</td>
                    <td className={'edit'}>Edit</td>
                    <td className={'view'}><Link to={`/main?type=parent&familyId=${family._id}`}>View</Link></td>
                  </tr>
                ))}
               </table>
            </div>
  )
}

export default Family
