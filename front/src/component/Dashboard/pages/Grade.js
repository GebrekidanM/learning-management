import React, { useEffect, useState } from 'react'
import URL from '../../UI/URL'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingIndicator from '../../common/LoadingIndicator'
import ErrorMessage from '../../common/ErrorMessage'
import CreateGrade from './Grade/CreateGrade'
import { Dropdown } from 'primereact/dropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Grade({semesterId,yearId}) {
  const [showCreateGrade,setShowCreateGrade] = useState(false)
  const [grades, setGrades] = useState([])
  const [selectedGrade,setSelectedGrade] = useState(null)
  const [error,setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {success} = location.state || {}

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        setError('')
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
  
  if (success) {
    toast.success(success, {
      onClose: () => navigate(`${location.pathname}${location.search}`, { replace: true, state: {} }),
      autoClose: 3000, // Duration in milliseconds
    });
  }

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
  const handleGrade= (e) =>{
    const select = grades.find(grade=>grade.grade === e.value)
      setSelectedGrade(select)
  }
  

  const handleSectionCreating = ()=>{
    navigate(`/main?type=grade&gradeId=${selectedGrade._id}`)
  }

  const handleEditGrade = ()=>{
    navigate(`/main?type=grade&gradeEdit=${semesterId}`)

  }
  const handleEditSemester=()=>{
    navigate(`/main?type=grade&semesterEdit=${yearId}`)


  }

  if(loading){
    return <LoadingIndicator/>
  }

  return (
    <div>
      <ToastContainer/>
      <div className='flex justify-content-between mt-6 w-10 mx-auto gap-6' >
        <div className='w-6 flex flex-column gap-3'>
          <div className='button bg-white text-cyan-900 w-full border-cyan-900 border-1 hover:bg-cyan-900 hover:text-white' onClick={handleCreateSemester}>Add new Semester</div>
          <div className='button bg-white text-cyan-900 w-full border-cyan-900 border-1 hover:bg-cyan-900 hover:text-white' onClick={handleAddGradeCard}>Add new Grade</div>
        </div>
        <div className='w-6 flex flex-column gap-3'>
          <div className='button bg-white text-cyan-900 w-full border-cyan-900 border-1 hover:bg-cyan-900 hover:text-white' onClick={handleEditSemester}>Edit Semester</div>
          <div className='button bg-white text-cyan-900 w-full border-cyan-900 border-1 hover:bg-cyan-900 hover:text-white' onClick={handleEditGrade}>Edit Grade</div>
        </div>
      </div>
      {error && <ErrorMessage error={error}/>}

      {!showCreateGrade && (
        grades &&
        <>
        <div className="w-10 mx-auto mt-3">
        <h3>Create Section</h3>
         <Dropdown 
            value={selectedGrade?.grade} 
            onChange={handleGrade} 
            options={gradeOptions} 
            optionLabel={"label"} 
            placeholder="Select A grade"
            className="mt-3 bg-white text-cyan-900 w-3 border-cyan-900 border-1 p-2"/>
          {selectedGrade &&
            <div 
                onClick={handleSectionCreating}
                className='button mt-3 bg-white text-cyan-900 w-3 border-cyan-900 border-1'>Create section</div>
          }
        </div>
        </>
      )}
      {showCreateGrade && <CreateGrade yearId={yearId} setShowCreateGrade={setShowCreateGrade} semesterId={semesterId}/>}
      
    </div>
  )
}

export default Grade