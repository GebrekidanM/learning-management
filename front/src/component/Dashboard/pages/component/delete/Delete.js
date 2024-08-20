import React from 'react'
import style from '../css/delete.module.css'
import { useNavigate } from 'react-router-dom'


function Delete({first,middle,role,id}) {
    const navigate = useNavigate()

    const handleDelete = async()=>{
        await fetch(`http://localhost:4000/member/delete/${id}`)
    }
    const handleGoBack = ()=>{
        return navigate(-1)
    }
  return (
    <div className={style.deleteContainer}>
        <div className={style.deleteCard}>
            <p>Do you want to delete {role} {first} {middle}</p>
            <div className={style.buttonBox}>
                <button className='button' onClick={handleDelete} >Yes!</button>
                <button className='button' onClick={handleGoBack}>No!</button>
            </div>
        </div>
    </div>
  )
}

export default Delete
