import React, { useEffect, useState } from 'react'
import URL from '../../UI/URL'
import { useNavigate } from 'react-router-dom'
import LoadingIndicator from '../../common/LoadingIndicator'
import ErrorMessage from '../../common/ErrorMessage'
import CreateGrade from './Grade/CreateGrade'

function Grade({semesterId,yearId}) {
  const [showCreateGrade,setShowCreateGrade] = useState(false)
  const [grades, setGrades] = useState([])
  const [error,setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL()}/class/grades/${semesterId}`);
        const json = await response.json();
        if (response.ok) {
          setGrades(json);
        } else {
          setError(json.error || 'Failed to fetch grades.');
        }
      } catch (error) {
        setError(`An error occurred: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    if (semesterId) {
      fetchGrades();
    }
  }, [semesterId]);
  
  console.log(grades)

  const handleCreateSemester = ()=>{
    navigate(`/create-semester?yearId=${yearId}`)
  }

  const handleAddGradeCard = ()=>{
    setShowCreateGrade(true)
  }
  


  if(loading){
    return <LoadingIndicator/>
  }

  return (
    <div>
      <div className='flex justify-content-between mt-6 w-10 mx-auto' >
        <div className='button ' onClick={handleCreateSemester}>Create Semester</div>
        <div className='button' onClick={handleAddGradeCard}>Add Grade</div>
      </div>
      {error && <ErrorMessage error={error}/>}
      {!showCreateGrade && grades && <p>Yes</p>}
      {showCreateGrade && <CreateGrade yearId={yearId} setShowCreateGrade={setShowCreateGrade} semesterId={semesterId}/>}
      
    </div>
  )
}

export default Grade