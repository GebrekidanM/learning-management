import React, { useEffect ,useState} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import style from "./css/pages.module.css"
import CreateTeacher from './create/CreateTeacher'

function Teacher() {
  const [yearId,setYearId] = useState({})
  const [yearError,setYearError] = useState('')
  const [teachers,setTeachers] = useState('')
  const [error,setError] = useState('')
  const [loading,setLoading] = useState('')
  const [searchParams] = useSearchParams()
  const teachType = searchParams.get('teachType')


    //here to pull at the end of the current link
    function generateNewSearchParams(key,value) {
      const type = new URLSearchParams(searchParams)
      type.set(key,value)
      return `?${type.toString()}`
    }

    useEffect(()=>{
      const fetchYear = async ()=>{
        const response = await fetch('http://localhost:4000/class/check-academic-year')
        const json = await response.json()
        if(response.ok){
          setYearId(json)
        }else{
          setYearError(json.error)
        }
      }
      fetchYear()
    },[])


      useEffect(()=>{
        const fetchTeachers = async ()=>{
          try {
            setLoading(true)
            const response = await fetch('http://localhost:4000/member/teachers')
            const json = await response.json()
            if(response.ok){
              setTeachers(json)
            }else{
              setError(json.error)
            }
          } catch (error) {
            setError(error)
          }finally{
            setLoading(false)
          }
          
        }
        fetchTeachers()
      },[])

  return (
    <div className={style.pageContainer}>
      <div className={style.pagehead}>
        <div className={style.searchCcontainer}>
            <input type="text" className={style.searchInput} placeholder="Search..."/>
            <button className={style.searchButton}> Search </button>
        </div>
        <Link 
            to={generateNewSearchParams('teachType','createTeacher')}  
            className={style.button}>Add new</Link>
      </div>
      <div>
        {
          teachType === 'createTeacher' 
          ? 
            <CreateTeacher yearId={yearId} yearError={yearError}/> 
          : 
            <div>
              {loading && <p>loading</p>}
              {error && <p className='error'>{error}</p>}

              <table >
                <tr>
                  <th> No </th>
                  <th> Name </th>
                  <th> phone No. </th>
                  <th colSpan={"3"}> Action</th>
                </tr>
                
                {teachers.length > 0 && teachers.map((teacher,index)=>(
                  <tr key={teacher._id}>
                    <td>{index + 1}</td>
                    <td>{teacher.first} {teacher.middle}</td>
                    <td>{teacher.phoneNo}</td>
                    <td className={'delete'}>Delete</td>
                    <td className={'edit'}>Edit</td>
                    <td className={'view'}><Link to={`/main?type=teacher&teacherId=${teacher._id}`}>View</Link></td>
                  </tr>
                ))}
               </table>
            </div>
        }
      </div>
    </div>
  )
}

export default Teacher
