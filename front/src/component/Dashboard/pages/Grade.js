import React, { useEffect, useState } from 'react'
import URL from '../../UI/URL'
import { useNavigate } from 'react-router-dom'
import LoadingIndicator from '../../common/LoadingIndicator'
import ErrorMessage from '../../common/ErrorMessage'
import CreateGrade from './Grade/CreateGrade'
import { Dropdown } from 'primereact/dropdown';

function Grade({semesterId,yearId}) {
  const [showCreateGrade,setShowCreateGrade] = useState(false)
  const [grades, setGrades] = useState([])
  const [selectedGrade,setSelectedGrade] = useState(null)
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
  
  const gradeOptions = grades.map(grade=>({
    label: `Grade ${grade.grade}`,
    value:grade.grade
  }))

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
        <div className='button bg-white text-cyan-900 w-3 border-cyan-900 border-1' onClick={handleCreateSemester}>Create Semester</div>
        <div className='button bg-white text-cyan-900 w-3 border-cyan-900 border-1' onClick={handleAddGradeCard}>Add Grade</div>
      </div>
      {error && <ErrorMessage error={error}/>}

      {!showCreateGrade && (
        grades &&
        <div className="w-10 mx-auto mt-3">
         <Dropdown 
            value={selectedGrade} 
            onChange={e=>setSelectedGrade(e.value)} 
            options={gradeOptions} 
            optionLabel={"label"} 
            placeholder="Select A grade"
            className="mt-3 bg-white text-cyan-900 w-3 border-cyan-900 border-1"/>
        </div>
      )}
      {showCreateGrade && <CreateGrade yearId={yearId} setShowCreateGrade={setShowCreateGrade} semesterId={semesterId}/>}
      
    </div>
  )
}

export default Grade