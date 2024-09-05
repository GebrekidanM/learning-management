import React,{useEffect,useState} from 'react'
import LoadingIndicator from '../../../common/LoadingIndicator'
import ErrorMessage from '../../../common/ErrorMessage'
import URL from '../../../UI/URL'

function NumberofStudent() {
    const [infos,setInfos] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')

  useEffect(()=>{
    const NubmerOfStudent = async () =>{
      try {
        setLoading(true)
        const response = await fetch(`${URL()}/member/numberOfStudent`) 
          const json = await response.json()
          if(response.ok){
            setInfos(json)
          }else{
            setError(json.error)
          }
      } catch (error) {
            setError(error.massege)
      }finally{
        setLoading(false)
      }
        
    }
    NubmerOfStudent()
  },[])
  
  return (
    <div>
      {
        loading ? <LoadingIndicator/>
        :
        
          <div>
              <table style={{marginTop:"2rem"}}>
                  <thead>
                    <tr>
                      <th> Grade </th>
                      <th> Section</th>
                      <th> No. of students</th>
                    </tr>
                  </thead>
                  {error ? <ErrorMessage error={error}/>
                  :
                    infos && infos.map((info,index)=>(
                      <tbody key={index}>
                          <tr>
                            <td>{info.grade}</td>
                            <td>{info.section}</td>
                            <td>{info.studentCount}</td>
                          </tr>
                      </tbody>
                    ))
                  }
              </table>
              
          </div>
        }
    </div>
  )
}

export default NumberofStudent
