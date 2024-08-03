import React from 'react'
import style from "../css/login.module.css"

function Signup() {
  return (
      <div className={style.logContainer}>
        <div className={style.logBox}>
          <div className={style.logSide}>
            <h2>Welcome to Nitsuh BG</h2>
            <button className={style.button}>Login</button>
          </div>
          <form >
            <h2>Create Account</h2>
              <input type='text' placeholder='Username'/>
              <input type='email' placeholder='example@gmail.com'/>
              <input type='password' placeholder='password'/>
              <input type='password' placeholder='confirm-password'/>
              <button type='submit'className={style.button}>Sign up</button>
          </form>
        </div>
      </div>
  )
}

export default Signup