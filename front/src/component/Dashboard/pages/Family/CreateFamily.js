import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import URL from '../../../UI/URL'
import ErrorMessage from '../../../common/ErrorMessage'

function CreateFamily({yearName}) {
    const navigate = useNavigate()
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)

    const [member,setMember] = useState({
        familyFrist:"",
        familyMiddle:"",
        familyLast:"",
        familyTel:"",
        familyEmail:"",
        familyPhone:"",
        yearName
    })
    const [familyPhoto,setFamilyPhoto] = useState('')

    const handleFamilyChange=(e)=>{
        const {name,value} = e.target
        setMember(prev=>{
            return {...prev,[name]:value}
        })
    }
    const handleFamilyFileChange=(e)=>{
        setFamilyPhoto(e.target.files)
    }

    //creating family
    const handleSubmit = async (e)=>{
        e.preventDefault()
        const data = new FormData()
        data.set('familyFirst',member.familyFrist)
        data.set("familyLast",member.familyLast)
        data.set('familyMiddle',member.familyMiddle)
        data.set('familyEmail',member.familyEmail)
        data.set('familyPhone',member.familyPhone)
        data.set('familyPhoto',familyPhoto[0])
        data.set('yearName',member.yearName)
        try {
            setLoading(true)
            const response = await fetch(`${URL()}/family`, {
                method: 'POST',
                body: data,
                credentials:'include',
            });

            const json = await response.json()
            if(response.ok){
                navigate(`/main?type=parent`, { replace: true });
            }else{
                setError(json.error)
            }
        } catch (error) {
            setError(error.message)
        }finally{
            setLoading(false)
        }
        
    }

  return (
    <div className={'mt-3'}>
        <form onSubmit={handleSubmit} className='grid grid-cols-2 grid-auto-row gap-4'>
            <h3 className='font-bold text-center col-span-2'>Family Members information</h3>
                    <div className='flex flex-col gap-4 '>
                      <div className='flex flex-col gap-2'>
                        <label>First Name:</label>
                          <input
                              type='text'
                              className='max-w-96'
                              name="familyFrist"
                              value={member.familyFrist}
                              onChange={handleFamilyChange}
                              required
                          />
                      </div>
                      <div className='flex flex-col gap-2'>
                          <label>Middle Name:</label>
                          <input
                              type='text'
                              className='max-w-96'
                              name="familyMiddle"
                              value={member.familyMiddle}
                              onChange={handleFamilyChange}
                              required
                          />
                      </div>
                      <div className='flex flex-col gap-2'>
                          <label>Last Name:</label>
                          <input type='text' className='max-w-96' name="familyLast" value={member.familyLast} onChange={handleFamilyChange} required/>
                      </div>
                    </div>
                    <div className='flex flex-col gap-4'>                  
                      <div className='flex flex-col gap-2'>
                          <label>Family Phone Number:</label>
                          <input type='number' className='max-w-96' name="familyPhone" value={member.familyPhone} onChange={handleFamilyChange} min="1" required/>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <label>Email:</label>
                        <input type='email' className='max-w-96' name='familyEmail' value={member.familyEmail} onChange={handleFamilyChange}/>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <label>Family Photo:</label>
                        <input type='file' className='max-w-96' name="familyPhoto" onChange={handleFamilyFileChange} required/>
                       </div>
                    </div>
                    {error && <ErrorMessage error={error}/>}
                 <button type="submit"  className={`col-start-1 col-end-3 mx-auto w-60 border-2 border-cyan-900 bg-white hover:bg-cyan-900 hover:text-white button max-w-96 ${loading ? 'cursor-wait':'cursor-pointer'}`}>{loading ? "Registering . . .":'Register'}</button>  
        </form>    
    </div>
  )
}

export default CreateFamily
