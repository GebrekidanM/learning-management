import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import LoadingIndicator from '../../common/LoadingIndicator';
import ErrorMessage from '../../common/ErrorMessage';
import URL from '../../UI/URL';

function Subject({semesterId}) {
  const [selectedGrade,setSelectedGrade] =useState('')
  const [selectedSection,setSelectedSection] =useState('')
  const [grades,setGrades]=useState([])
  const [sections,setSections] = useState([])
  const [error,setError] = useState('')
  const [errorSec,setErrorSec] = useState('')
  const [errorSub,setErrorSub] = useState('')
  const [loadingSub,setLoadingSub] = useState(false)
  const [loading,setLoading] = useState(false)
  const [loadingSec,setLoadingSec] = useState(false)

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

  useEffect(()=>{
    const fetchSection = async ()=>{
      try {
        setLoadingSec(true);
        setErrorSec('')
        const response = await fetch(`${URL()}/class/sections/${selectedGrade._id}`);
        const json = await response.json();
        if (response.ok) {
          setSections(json);
        } else {
          setErrorSec(json.error || 'Failed to fetch grades.');
        }
      } catch (error) {
        setErrorSec(`An error occurred: ${error.message}`);
      } finally {
        setLoadingSec(false);
      }
    } 
    if(selectedGrade){
      fetchSection()
    }
  },[selectedGrade])

  useEffect(()=>{
    const fetchSubject = ()=>{
      try {
        setLoadingSub(true)
        
      } catch (error) {
        
      }finally{
        setLoadingSub(false)
      }
    }
    if(selectedSection){
      fetchSubject()
    }
    
  },[selectedSection])

  const gradeOptions = grades.map(grade=>(
    {
      label:`Grade ${grade.grade}`,
      value:grade.grade
    }
  ))
  const sectionOptions = sections.map(section=>(
    {
      label:`Section ${section.section}`,
      value:section.section
    }
  ))
  const handleGrade= (e) =>{
    const select = grades.find(grade=>grade.grade === e.value)
      setSelectedGrade(select)
  }

  const handleSection= (e) =>{
    const select = sections.find(section=>section.section === e.value)
      setSelectedSection(select)
  }
 
  const handleSubjectCreating = () =>{

  }

  if(loading){
    return <LoadingIndicator/>
  }

  return (
  <div className={`w-full mt-5 flex flex-clumn`}>
    <div className={`w-full mt-5 flex  justify-content-between`}>
        <div className="w-6 mx-auto mt-3">
          {error && <ErrorMessage error={error}/>}
          <Dropdown 
              value={selectedGrade?.grade} 
              onChange={handleGrade} 
              options={gradeOptions} 
              optionLabel={"label"} 
              placeholder="Select A grade"
              className="w-6 bg-white text-cyan-900 w-3 border-cyan-900 border-1"/>
        </div>
        <div className="w-6 mx-auto mt-3">
          {loadingSec && <LoadingIndicator/>}
          {errorSec && <ErrorMessage error={errorSec}/>}
          {selectedGrade &&
              <Dropdown 
                value={selectedSection?.section} 
                onChange={handleSection} 
                options={sectionOptions} 
                optionLabel={"label"} 
                placeholder="Select A section"
                className="w-6 bg-white text-cyan-900 w-3 border-cyan-900 border-1"/> 
            }
        </div>
    </div>
    <div>
      {}
    </div>
  </div>
  )
}

export default Subject
