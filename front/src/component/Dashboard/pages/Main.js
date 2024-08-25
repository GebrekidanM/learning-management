import React,{useEffect,useState} from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import style from '../../css/Dashbord.module.css'

function Main({year}) {
  const [info,setInfo] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')

  useEffect(()=>{
    const NubmerOfStudent = async () =>{
      try {
        setLoading(true)
        const response = await fetch('http://localhost:4000/member/numberOfStudent') 
          const json = await response.json()
          if(response.ok){
            setInfo(json)
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
console.log(info)
  return (
    <div>
      <button className={`button ${style.buttonSetUp}`} onClick={year} >Create New Acadamic Year</button>
      {
        loading ? <p className='loading'>loading ...</p>
        :
        <>{error ? <p className='error'>{error}</p>
        :
          <div>
              <DataTable value={info} tableStyle={{ minWidth: '50rem' }}>
                  <Column field='no' header="No"></Column>
                  <Column field="grade" header="Grade"></Column>
                  <Column field="section" header="Section"></Column>
                  <Column field="studentCount" header="Number of student"></Column>
              </DataTable>
          </div>
        }</>
      }
    </div>
  )
}

export default Main
