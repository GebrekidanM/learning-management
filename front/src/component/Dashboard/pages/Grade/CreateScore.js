import React,{useState} from 'react'
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

function CreateScore({subjectId}) {
    const [value,setValue] = useState(null)
    const [outOf,setOutOf] = useState(null)
    const [description,setDescription] = useState('')

    //subjectId, studentId, teacherId 
  return (
    <div className='flex align-items-center justify-content-between w-full'>
      <form>
        <FloatLabel>
            <InputText id="score" value={value} onChange={(e) => setValue(e.target.value)}/>
            <label htmlFor="score">Score</label>
        </FloatLabel>
        <FloatLabel>
            <InputText id="outOf" value={outOf} onChange={(e) => setOutOf(e.target.value)}/>
            <label htmlFor="outOf">OutOf</label>
        </FloatLabel>
        <FloatLabel>
            <InputText id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
            <label htmlFor="description">Description</label>
        </FloatLabel>
        
      </form>
    </div>
  )
}

export default CreateScore
