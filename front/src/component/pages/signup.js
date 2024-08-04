import React, { useState } from 'react'
import style from "../css/login.module.css"

function Signup() {
  const [userData, setUserData] = useState({
        username:"",
        email:"",
        role:"",
        password:"",
        repassword:""
  })
  const [userError,setUserError] = useState({
        username:"",
        email:"",
        role:"",
        password:"",
        repassword:""
  })

  const handleChange = (e)=>{
    setUserData(prev=>{
      return {...prev, [e.target.name]:e.target.value}
    })
  }

  const validateUsername = (username) => {
    if (!username) {
      return 'Username is required';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (!/^[A-Za-z]+$/.test(username)) {
      return 'Username can only contain alphabets';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    // Add additional password validation logic if needed
    return '';
  };

  const validateRepassword = (password, repassword) => {
    if (!repassword) {
      return 'Re-entering password is required';
    }
    if (password !== repassword) {
      return 'Passwords do not match';
    }
    return '';
  };


const handleSubmit = (e)=>{
  e.preventDefault()
  let errors = {};

    if (!userData.username) {
      errors.username = 'Username is required';
    }
    else if (userData) {
      
    } else {
      
    }
}
console.log(userError)
  return (
      <div className={style.logContainer}>
        <div className={style.logBox}>
          <div className={style.logSide}>
            <h2>Welcome to Nitsuh BG</h2>
            <button className={style.button}>Login</button>
          </div>
          <form onSubmit={handleSubmit} >
            <h2>Create Account</h2>
              <input type='text' name='username'  placeholder='Username' value={userData.username} onChange={handleChange}/>
              <input type='email' name='email' placeholder='example@gmail.com' value={userData.email} onChange={handleChange}/>
              <select id="role" name='role' value={userData.role} onChange={handleChange}>
                  <option value="">--Please choose an option--</option>
                  <option value="Director">Director</option>
                  <option value="Editor">Editor</option>
              </select>
              <input type='password' name='password' placeholder='password' value={userData.password} onChange={handleChange}/>
              <input type='password' name='repassword' placeholder='confirm-password' value={userData.repassword} onChange={handleChange}/>
              <button type='submit'className={style.button}>Sign up</button>
          </form>
        </div>
      </div>
  )
}

export default Signup