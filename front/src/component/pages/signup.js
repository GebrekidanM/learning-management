import React, { useState } from 'react'
import {Link} from 'react-router-dom'
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

  const usernameError = validateUsername(userData.username);
    if (usernameError) {
      errors.username = usernameError;
    }

    const passwordError = validatePassword(userData.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    const repasswordError = validateRepassword(userData.password, userData.repassword);
    if (repasswordError) {
      errors.repassword = repasswordError;
    }



    setUserError(errors);

    if (Object.keys(errors).length === 0) {
      console.log('Form submitted successfully', userData);
    }

}

return (
      <div className={style.logContainer}>
        <div className={style.logBox}>
          <div className={style.logSide}>
            <h2>Welcome to Nitsuh BG</h2>
            <Link to='/login' className={style.button}>Login</Link>

          </div>
          <form onSubmit={handleSubmit} >
            <h2>Create Account</h2>
              <input type='text' name='username'  placeholder='Username' value={userData.username} onChange={handleChange}/>
              {userError.username && <p style={{ color: 'red' }}>{userError.username}</p>}
              <input type='email' name='email' placeholder='example@gmail.com' value={userData.email} onChange={handleChange}/>
              
              <select id="role" name='role' value={userData.role} onChange={handleChange} className={style.customSelect}>
                  <option value="">--Please choose an option--</option>
                  <option value="Director">Director</option>
                  <option value="Editor">Editor</option>
              </select>
              {userError.role && <p style={{ color: 'red' }}>{userError.role}</p>}
              <input type='password' name='password' placeholder='password' value={userData.password} onChange={handleChange}/>
              {userError.password && <p style={{ color: 'red' }}>{userError.password}</p>}
              <input type='password' name='repassword' placeholder='confirm-password' value={userData.repassword} onChange={handleChange}/>
              {userError.repassword && <p style={{ color: 'red' }}>{userError.repassword}</p>}
              <button type='submit'className={style.button}>Sign up</button>
          </form>
        </div>
      </div>
  )
}

export default Signup