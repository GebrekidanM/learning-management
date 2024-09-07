import React, { useEffect, useState } from 'react'
import URL from '../../../UI/URL'
import LoadingIndicator from '../../../common/LoadingIndicator'
import ErrorMessage from '../../../common/ErrorMessage'
import { useLocation } from 'react-router-dom'

function ViewSection({gradeId}) {
    const [sections,setSections] = useState([])
    const [error,setError]= useState('')
    const [loading,setLoading]= useState(false)
    const location = useLocation()
    const {grade} = location.state||{}

console.log(location)

    useEffect(()=>{
        const fetchSections = async()=>{
            try {
                setLoading(true)
                const response = await fetch(`${URL()}/class/sections/${gradeId}`)
                const json = await response.json()

                if(response.ok){
                    setSections(json)
                }else{
                    setError(json.error)
                }
            } catch (error) {
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }
        fetchSections()
    },[gradeId])

    if(loading){
        return <LoadingIndicator/>
    }
  return (
    <div className='mt-8 w-8 mx-auto'>
        <h3>Sections in Grade {grade}</h3>
        <div className='mt-3 w-full flex flex-column gap-3'>
            {error && <ErrorMessage error={error}/>}
            {sections?.map(section=>(
                <div key={section._id} className={` button w-4 bg-white text-cyan-900 w-full border-cyan-900 border-1 hover:bg-cyan-900 hover:text-white`}> {section.section}</div>
            ))}
        </div>
    </div>
  )
}

export default ViewSection
