import React,{useEffect,useState} from 'react'
import LoadingIndicator from '../common/LoadingIndicator'
import { useLocation } from 'react-router-dom'
function MarkList({subjectId}) {
    const [markListInfos, setMarkListInfos] = useState([])
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const location = useLocation()
    const {grade,section, subjectName} = location.state || {}

    useEffect(()=>{
        const getMarklist = async()=>{
            try {
                setLoading(true)
                 const response = await fetch(`http://localhost:4000/score/subject/${subjectId}`)
                 const json = await response.json()
                 if(response.ok){
                    setMarkListInfos(json)
                 }else{
                    setError(json.error)
                 }
            } catch (error) {
                setError(error.message)     
            }finally{
                setLoading(false)
            }  
        }
        getMarklist()
    },[subjectId])

    if(loading){
        return <LoadingIndicator/>
    }

    console.log("score",markListInfos)
  return (
    <div>
        <h3 className='text-center'>Mark List of {subjectName} Grade {grade}{section} students</h3>
        <table className='w-full'>
            <thead>
                <tr>
                    <th className='w-2rem'>No</th>
                    <th>Name</th>
                    <th className='w-3rem'>Sex</th>
                    <th className='w-3rem'>Age</th>
                    <th>Teacher</th>
                    <th className='w-3rem'>Sum</th>
                    {markListInfos && markListInfos?.scores?.map(markListInfo=>(
                        <p key={markListInfo._id}>{}</p>
                    ))}
                    <th className='w-3rem'>Average</th>
                </tr>
            </thead>
            {markListInfos?.length > 0 
            ?
            <tbody>
                <tr>
                    <td>hello</td>
                </tr>
            </tbody>
            :
            <tbody>
                <tr>
                    <td colSpan="7" className="text-center">
                        {error && <p className='error w-full'>{error}</p> }
                    </td>
                </tr>
            </tbody>
            }
        </table>       
    </div>
  )
}

export default MarkList
