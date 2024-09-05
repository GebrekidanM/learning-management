import React, { useEffect, useState } from 'react'
import URL from '../../UI/URL'
import { useNavigate } from 'react-router-dom'

function Grade({semesterId,yearId}) {

  const [grades, setGrades] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
  },[])

  const handleCreateSemester = ()=>{
    navigate(`/create-semester?yearId=${yearId}`)
  }
  //creating new grade by using semesterId and yearId
  const handleAddGrade = async ()=>{
      try {
        const response = await fetch(`${URL()}/class/create/grade/${yearId}/${semesterId}`)

        
      } catch (error) {
        
      }
  }


  return (
    <div>
      <div onClick={handleCreateSemester}>Create Semester</div>
      <div onClick={handleAddGrade}>Add Grade</div>

      {}
      
    </div>
  )
}

export default Grade