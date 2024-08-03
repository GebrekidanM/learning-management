import React from 'react'
import style from "../css/login.module.css"

function Login() {
  return (
      <div className={style.logBox}>
        <div className={style.logSide}>
            <h2>Are you new?</h2>
            <button className={style.button}>Sign up</button>

        </div>
        <form>
            <h2>Login to your account</h2>
            <input type='text' placeholder='Username'/>
            <input type='password' placeholder='***********'/>
            <button className={style.button}>Login</button>
        </form>
      </div>
  )
}

export default Login