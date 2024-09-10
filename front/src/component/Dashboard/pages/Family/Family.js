import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import style from "../css/pages.module.css"
import Delete from '../Delete/Delete'
import LoadingIndicator from '../../../common/LoadingIndicator'
import ErrorMessage from '../../../common/ErrorMessage'
import URL from '../../../UI/URL'

const Family = () => {
  const [error,setError] = useState('')
  const [loading,setLoading] = useState('')
  const [families,setFamilies] = useState('')
  const [deleteCard,setDeleteCard] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false);  // Add a state for refresh trigger
  const [selectedFamilyId,setSelectedFamilyId] = useState('')


  const fetchFamily = async ()=>{
    try {
      setLoading(true)
        const response = await fetch(`${URL()}/families`)
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
    
useEffect(()=>{
    fetchFamily()
  },[])

// Refetch families when delete is successful
useEffect(() => {
  fetchFamily();
}, [refreshTrigger]);  // Trigger refetch when refreshTrigger changes

const handleDeleteCard = (familyId)=>{
  setSelectedFamilyId(familyId)
  setDeleteCard(true)

}

const handleDeleteSuccess = () => {
  setDeleteCard(false);
  setRefreshTrigger(prev => !prev);  // Toggle refresh trigger
}



  return (
    <div className={style.pageContainer}>

              <table style={{marginTop:"2rem"}}>
              <thead>
                <tr>
                  <th> No </th>
                  <th> Family Name </th>
                  <th> Student Name </th>
                  <th>Family Type</th>
                  <th colSpan={"3"}> Action</th>
                </tr>
              </thead>      
  
              {loading && <LoadingIndicator/>}
              {error && <ErrorMessage error={error}/>}

                {families.length > 0 && families.map((family,index)=>(
                <tbody key={family._id}>  
                  <tr >
                    <td>{index + 1}</td>
                    <td>{family.familyFirst} {family.familyMiddle}</td>
                    <td>{family.studentId.first} {family.studentId.middle}</td>
                    <td>{family.familyType}</td>
                    <td className={'delete'} onClick={()=>handleDeleteCard(family._id)}>Delete</td>
                    <td className={'edit'}>
                      <Link to={`/main?type=parent&action=${family._id}`}>Edit</Link>
                    </td>
                    <td className={'view'}>
                      <Link to={`/main?type=parent&familyId=${family._id}`}>View</Link>
                    </td>
                  </tr>
                </tbody>  
                ))}
               </table>
               {deleteCard && 
               <Delete
                    setDeleteCard={setDeleteCard}
                    first={families.find(family=>family._id === selectedFamilyId)?.familyFirst}
                    middle={families.find(family=>family._id === selectedFamilyId)?.familyMiddle}
                    id={selectedFamilyId}
                    role={'family'}
                    onDeleteSuccess={handleDeleteSuccess}
               />}
            </div>
  )
}

export default Family
