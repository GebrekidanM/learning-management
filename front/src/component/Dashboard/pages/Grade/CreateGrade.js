import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputNumber } from 'primereact/inputnumber'
import { Card } from 'primereact/card'
import ErrorMessage from '../../../common/ErrorMessage'
import URL from '../../../UI/URL'

function CreateGrade({yearId,semesterId,setShowCreateGrade}) {
    const [grade,setGrade] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    //creating new grade by using semesterId and yearId
  const handleAddGrade = async (e)=>{
        e.preventDefault()

        try {
            setLoading(true)
        const response = await fetch(`${URL()}/class/create/grade`,{
            method:'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({yearId,semesterId,grade})
        })

        const json = response.json()
        if(response.ok){

            navigate(`/main?type=grade?gradeId=${json._id}`)
        }
        
        } catch (error) {
        setError(error.message)
        }finally{
            setLoading(false)
        }
    }

    const handelShow = ()=>{
        setShowCreateGrade(false)
    } 

  return (
    <Card title="Create New Grade" className='mt-5 mx-auto w-4 bg-cyan-900 text-white text-center' >
        {error && <ErrorMessage error={error}/>}
        <form onSubmit={handleAddGrade} className='flex flex-column w-10 mx-auto'>
            <label className='text-left'>Grade:</label>
            <InputNumber style={{marginTop:"1rem"}} value={grade} onValueChange={(e) => setGrade(e.value)} min={1} max={12} />
            <div className='mt-3 flex justify-content-between'>
                <button className={`button bg-yellow-700 hover:bg-cyan-900 ${loading ? 'cursor-wait' : 'cursor-pointer'}`} type='submit' >{loading ? "creating..." : "Create"}</button>
                <button className='button bg-yellow-700 hover:bg-cyan-900' onClick={handelShow}>Cancel</button>
            </div>
        </form>
      
    </Card>
  )
}

export default CreateGrade
