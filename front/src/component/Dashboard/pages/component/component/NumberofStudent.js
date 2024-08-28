import React,{useEffect,useState} from 'react'

function NumberofStudent() {
    const [infos,setInfos] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')

  useEffect(()=>{
    const NubmerOfStudent = async () =>{
      try {
        setLoading(true)
        const response = await fetch('http://localhost:4000/member/numberOfStudent') 
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
        loading ? <p className='loading'>loading ...</p>
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
                  {error ? <p className='error'>{error}</p>
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