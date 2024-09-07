import React, { useState } from 'react'
import style from '../css/pages.module.css'
import {useNavigate} from 'react-router-dom'
import URL from '../../../UI/URL'

function CreateFamily({studentId}) {
    const navigate = useNavigate()

    const [member,setMember] = useState({
        familyFrist:"",
        familyMiddle:"",
        familyLast:"",
        familyType:"",
        familyTel:"",
        familyEmail:"",
        familyPhone:"",
        studentId
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
    const handleSubmit = async (e)=>{
        e.preventDefault()
        const data = new FormData()
        data.set('familyFirst',member.familyFrist)
        data.set("familyLast",member.familyLast)
        data.set('familyMiddle',member.familyMiddle)
        data.set('familyEmail',member.familyEmail)
        data.set('familyPhone',member.familyPhone)
        data.set('familyType',member.familyType)
        data.set('studentId',member.studentId)
        data.set('familyPhoto',familyPhoto[0])
        const response = await fetch(`${URL()}/member/family`, {
            method: 'POST',
            body: data,
        });
        if(response.ok){
            navigate(`/main?type=student&studentId=${studentId}`, { replace: true });
        }
    }

  return (
    <div className={style.createBox}>
        <form onSubmit={handleSubmit}>
            <h3>Family Members information</h3>
            <div className={style.familyBox}>
              <div className={style.inLineBox}>
                  <div className={style.info}>    
                      <label>First Name:</label>
                          <input
                              type='text'
                              name="familyFrist"
                              value={member.familyFrist}
                              onChange={handleFamilyChange}
                              required
                          />
                      </div>
                      <div className={style.info}>
                            <label>Middle Name:</label>
                          <input
                              type='text'
                              name="familyMiddle"
                              value={member.familyMiddle}
                              onChange={handleFamilyChange}
                              required
                          />
                        </div>
                      <div className={style.info}>
                          <label>Last Name:</label>
                          <input type='text' name="familyLast" value={member.familyLast} onChange={handleFamilyChange} required/>
                      </div>
                    </div>
                  <div className={style.inLineBox}>                  
                        <div className={style.info}>
                          <label>Family Type:</label>
                          <input type='text' name="familyType" value={member.familyType} onChange={handleFamilyChange} required/>
                      </div>
                      <div className={style.info}>
                          <label>Family Phone Number:</label>
                          <input type='number' name="familyPhone" value={member.familyPhone} onChange={handleFamilyChange} min="1" required/>
                      </div>
                      <div className={style.info}>
                        <label>Email:</label>
                        <input type='email' name='familyEmail' value={member.familyEmail} onChange={handleFamilyChange}/>
                      </div>
                      <div className={style.info}>
                        <label>Family Photo:</label>
                        <input type='file' name="familyPhoto" onChange={handleFamilyFileChange} required/>
                       </div>
                    </div>
                    
                </div>
                 <button type="submit"  className={'button'}>Register</button>  
        </form>    
    </div>
  )
}

export default CreateFamily
