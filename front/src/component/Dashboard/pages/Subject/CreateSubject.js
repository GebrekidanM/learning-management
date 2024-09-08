import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'
import ErrorMessage from '../../../common/ErrorMessage'

function CreateSubject({sectionId}) {
    const [error,setError]= useState('')
    const [loading,setLoading] = useState(false)
    const [name,setName] = useState('')

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try {
            setLoading(true)
            const response = await fetch(`${URL()}/subject/create`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({sectionId,name})
            })
            const json = await response.json()
            if(!response.ok){
                setError(json.error)
            }else{
                console.log('fine')
            }
        } catch (error) {
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }

  return (
    <Card className="w-4 mt-7 mx-auto bg-cyan-900 flex flex-column justify-content-center">
        <h2 className='text-white -mt-3'>Select Section</h2>
        <form onSubmit={handleSubmit} className=''>
            {error ? <ErrorMessage error={error}/>:
                <div className="flex flex-column gap-2">
                    <label htmlFor="subject">Subject</label>
                    <InputText id="subject" aria-describedby="subject-help" onChange={e=>setName(e.target.value)}/>
                    <small id="subject-help">
                        Enter Subject name correctly!.
                    </small>
                </div>
            }
            <button className={`button hover:bg-cyan-900 ${loading ? 'bg-cyan-900 cursor-wait' : 'bg-yellow-700'} mt-3 w-full`} type='submit'>
                {`${loading ? 'Creating' : 'Create' }`}
            </button>
        </form>
      </Card>
  )
}

export default CreateSubject
