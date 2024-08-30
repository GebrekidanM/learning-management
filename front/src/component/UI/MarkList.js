import React,{useEffect,useState} from 'react'

function MarkList({subjectId}) {
    const [markListInfos, setMarkListInfos] = useState([])
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)

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

  return loading  ? <p className='loading'>Loading ... </p> : (
    <div>
        <h3 className='text-center'>Mark List</h3>
        <table className='w-full'>
            <thead>
                <tr>
                    <th className='w-2rem'>No</th>
                    <th>Name</th>
                    <th className='w-3rem'>Sex</th>
                    <th className='w-3rem'>Age</th>
                    <th>Teacher</th>
                    <th className='w-3rem'>Sum</th>
                    {/**markListInfos && markListInfos?.scores.map(markListInfo=>(
                        <p key={markListInfo._id}>Hello</p>
                    ))description */}
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
