import React from 'react'
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
  return (
    <div className={style.createBox}>
      <form>
        <h2>Register Student</h2>
        <div className={style.nameBox}>
            <div className={style.info}>
                <label>First name:</label>
                <input type='text' />
            </div>
            <div className={style.info}>
                <label>Middle name:</label>
                <input type='text' />
            </div>
            <div className={style.info}>
                <label>Last name:</label>
                <input type='text' />
            </div>
        </div>
        
        
         {/**  gendar  */}
        <div className={`${style.info} ${style.infoContainer}`}>
            <label>Gender:</label>
            <div>
                <span><input type="radio" name="gender" value="Male"/> Male</span>
                <span><input type="radio" name="gender" value="Female"/> Female</span>
            </div>
        </div>
       <div className={style.ageGrade}> 
            {/** age */}
            <div className={`${style.info} ${style.infoContainer}`}>
                <label>Age:</label>
                <input type='number' />
            </div>
        
            {/** Grade */}
            <div className={`${style.info} ${style.infoContainer}`}>
            <label>Grade:</label>
            <select>
                {grades && grades.map(grade=>(
                    <option value={grade.grade}>{grade.grade}</option>
                ))}
            </select>
            </div>
        </div>
        {/** Adress information */}
        <div className={style.adressInfo}>
            <div className={style.info}>
                <label>Region/ State</label>
                <input type='text' />
            </div>
            <div className={style.info}>
                <label>City</label>
                <input type='text' />
            </div>
            <div className={style.info}>
                <label>Subcity/ Zone</label>
                <input type='text' />
            </div>
            <div className={style.info}>
                <label>Wereda</label>
                <input type='text' />
            </div>
            <div className={style.info}>
                <label>House No.</label>
                <input type='text' />
            </div>
        </div>
        <button type='submit' className={`${style.button} ${style.submit}`}>Register</button>

      </form>
    </div>
  )
}

export default CreateStudent
