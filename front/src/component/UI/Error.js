import React from 'react'
import style from '../css/error.module.css'
import { PiSmileySadBold } from "react-icons/pi";
import { useHistory } from 'react-router-dom';

function Error() {
  const history = useHistory();

  const handleGoBack = ()=>{
    history.goBack()
  }
  return (
    <div className={style.ContainterError} >
      <div className={style.errorBox} >
        <div className={style.error}>
          <PiSmileySadBold className={style.emoji}/>
          <p> Error type 500. Check your connection</p>
        </div>
        <button className='button' onClick={handleGoBack}>Try again</button>
      </div>
    </div>
  )
}

export default Error