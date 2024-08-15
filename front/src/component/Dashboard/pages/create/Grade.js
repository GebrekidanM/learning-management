import React, { useState ,useEffect} from 'react'
import style from "../css/pages.module.css" 

function Grade() {
  const [grades,setGrades] = useState()
  const [gradeError,setGradeError] = useState()
  const [sections,setSections] = useState()
  const [sectionsError,setSectionsError] = useState()
  const [students,setStudents] = useState()


  useEffect(()=>{
      const fetchGrades = async()=>{
        try {
          const response = await fetch('http://localhost:4000/member/grades')
          const json = await response.json()
          if(response.ok){
            return setGrades(json)
          }
          setGradeError(json)
        } catch (error) {
          setGradeError(error)
        }
        
    }
    fetchGrades()
  },[])

  const fetchSections = async (gradeId) => {
    await fetch(`http://localhost:4000/member/sections/${gradeId}`)
     .then(response => response.json())
     .then(data => setSections(data))
     .catch(error => console.error('Error fetching sections:', error));
};

 const fetchStudents = async(sectionId) => {
     await fetch(`http://localhost:4000/member/students/${sectionId}`)
         .then(response => response.json())
         .then(data => setStudents(data))
         .catch(error => ('Error fetching students:', error));
 };

 return (
    <div style={style.grade}>
      {gradeError && <p className='error'>{gradeError}</p>}

        {grades?.length > 0 && grades.map(grade=>(
          <button className='button' key={grade._id} onClick={() => fetchSections(grade._id)}>
                 Grade {grade.grade}
          </button>
        ))}

      {sectionsError && <p className='error'>{sectionsError}</p>}
        {sections?.length > 0 && (
                <div>
                    <h2>Select a Section</h2>
                    {sections.map(section => (
                        <button className='button' key={section._id} onClick={() => fetchStudents(section._id)}>
                            Section {section.section}
                        </button>
                    ))}
                </div>
            )}

        {students?.length > 0 && (
                <div>
                    <h3>Students in Section</h3>
                    <ul>
                        {students.map(student => (
                            <li key={student._id}>
                                {student.first} {student.last}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
    </div>
  )
}

export default Grade
