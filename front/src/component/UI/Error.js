import React from 'react'
import style from '../css/error.module.css'
import { PiSmileySadBold } from "react-icons/pi";

function Error({error}) {
  return (
    <div className={style.ContainterError} >
      <div >
        <div>
          <PiSmileySadBold/>
          <p>{error}</p>
        </div>
        <button className='button'>Try again</button>
      </div>
    </div>
  )
}

export default Error