import React, { useContext, useState } from 'react'
import {Link, Navigate} from 'react-router-dom'
import style from "../css/login.module.css"
import { AuthContext } from '../../context/AuthContext'

function Login() {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [userError,setUserError] = useState({
    username:"",
    password:"",
  })
  const [serverError,setServerError] = useState('')
  const {setLoggedUser,loggedUser} = useContext(AuthContext)

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

const handleSubmit = async(e)=>{
  e.preventDefault()
  setServerError('');
  let errors = {};

  const usernameError = validateUsername(username);
    if (usernameError) {
      errors.username = usernameError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    setUserError(errors);

    if (!errors.username && !errors.password) {
      try {
        const response = await fetch('http://localhost:4000/user/',{
          method:'POST',
          body:JSON.stringify({username,password}),
          headers:{'Content-Type':'application/json'},
          credentials: 'include'
        })
        const json = await response.json()
        
        if(response.ok){
          setLoggedUser(json)
        }else{
          setServerError(json.error)
        }
      
      } catch (error) {
        setServerError(error.message)
        
      }
      
  }
}

if (loggedUser) {
  return <Navigate to='/'/>
}

  return (
      <div className={style.logBox}>
        <div className={style.logSide}>
            <h2>Are you new?</h2>
            <Link to='/signup' className={style.button}>Sign up</Link>
        </div>
        <form onSubmit={handleSubmit}>
            <h2>Login to your account</h2>
            {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
            <input type='text' value={username} onChange={e=>setUsername(e.target.value)} placeholder='Username'/>
            {userError.username && <p style={{ color: 'red' }}>{userError.username}</p>}
            
            <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='***********'/>
            {userError.password && <p style={{ color: 'red' }}>{userError.password}</p>}
            
            <button className={style.button} type='submit'>Login</button>
        </form>
      </div>
  )
}

export default Login