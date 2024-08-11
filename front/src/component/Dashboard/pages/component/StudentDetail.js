import React, { useEffect, useState } from 'react'

function StudentDetail({studentId}) {
    const [student,setStudent] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        const fetchAstudent = async()=>{
            setLoading(true)
            try {
               const response = await fetch(`http://localhost:4000/member/${studentId}`)
               const json = await response.json()
               if(response.ok){
                console.log(json)
                  setStudent(json.getStudent)
               }else{
                setError(json.error)
               }
            } catch (error) {
                setError(error)
            }finally {
                setLoading(false);
            }            
        }
        fetchAstudent() 
    },[])


  return (
    <div>
      {loading && <p>Loading...</p>}
      <div>
        <h3>Basic informations</h3>
        <h4>{student.first}</h4>
      </div>

    </div>
  )
}

export default StudentDetail
