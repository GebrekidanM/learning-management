import React, { useState } from 'react'
import style from '../css/pages.module.css'


const grades = [
   { grade:1},
    {grade:2},
    {grade:3},
    {grade:4},
    {grade:5},
    {grade:6},
    {grade:7},
    {grade:8},
]

function CreateStudent() {
    const [userData,setUserData] = useState({
        first:"",
        middle:"",
        last:"",
        gender:"",
        age:"",
        grade:"",
        region:"",
        city:"",
        subCity:"",
        wereda:"",
        houseNo:"",
        familyTel:""
    })

    const handleonChange = (e)=>{
        const {name,value} = e.target
        setUserData(prev=>{
            return({...prev, [name]: value})
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try {        
                const response = await fetch('http://localhost:4000/member/',{
                    method:'POST',
                    body:JSON.stringify(userData),
                    headers:{'Content-Type':'application/json'}
                }) 
                const json = await response.json()
                if(response.ok){
                    console.log('done')
                }else{
                    console.log('something is wrong')
                }
        } catch (error) {
                    
        }
    }


  return (
    <div className={style.createBox}>
      <form onSubmit={handleSubmit}>
        <h2>Register Student</h2>
        <div className={style.nameBox}>
            <div className={style.info}>
                <label>First name:</label>
                <input type='text' name="first" value={userData.first} onChange={handleonChange} />
            </div>
            <div className={style.info}>
                <label>Middle name:</label>
                <input type='text' name="middle" value={userData.middle} onChange={handleonChange} />
            </div>
            <div className={style.info}>
                <label>Last name:</label>
                <input type='text' name="last" value={userData.last} onChange={handleonChange} />
            </div>
        </div>
        
        
         {/**  gendar  */}
        <div className={`${style.info} ${style.infoContainer}`}>
            <label>Gender:</label>
            <div>
                <span><input type="radio" name="gender" value="Male" onChange={handleonChange}/> Male</span>
                <span><input type="radio" name="gender" value="Female"  onChange={handleonChange}/> Female</span>
            </div>
        </div>
       <div className={style.ageGrade}> 
            {/** age */}
            <div className={`${style.info} ${style.infoContainer}`}>
                <label>Age:</label>
                <input type='number' name="age" value={userData.age} onChange={handleonChange} />
            </div>
        
            {/** Grade */}
            <div className={`${style.info} ${style.infoContainer}`}>
                <label>Grade:</label>
                <select name="grade" value={userData.grade} onChange={handleonChange}>
                        <option value="" disabled>Select a grade</option>
                    {grades && grades.map(grade=>(
                        <option value={grade.grade}>{grade.grade}</option>
                    ))}
                </select>
            </div>
            {/** phone number */}
            <div className={`${style.info} ${style.infoContainer}`}>
                <label>Family phone number:</label>
                <input type='tel' name="familyTel" value={userData.familyTel} onChange={handleonChange} />
            </div>
        
        </div>
        {/** Adress information */}
        <div className={style.adressInfo}>
            <div className={style.info}>
                <label>Region/ State</label>
                <input type='text' name="region" value={userData.region} onChange={handleonChange}/>
            </div>
            <div className={style.info}>
                <label>City</label>
                <input type='text' name="city" value={userData.city} onChange={handleonChange} />
            </div>
            <div className={style.info}>
                <label>Subcity/ Zone</label>
                <input type='text' name="subCity" value={userData.subCity} onChange={handleonChange} />
            </div>
            <div className={style.info}>
                <label>Wereda</label>
                <input type='text' name="wereda" value={userData.wereda} onChange={handleonChange} />
            </div>
            <div className={style.info}>
                <label>House No.</label>
                <input type='text' name="houseNo" value={userData.houseNo} onChange={handleonChange} />
            </div>
        </div>
        <button type='submit' className={`${style.button} ${style.submit}`}>Register</button>

      </form>
    </div>
  )
}

export default CreateStudent
