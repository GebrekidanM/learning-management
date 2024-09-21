import React, { useContext, useState } from 'react'
import {Link, Navigate} from 'react-router-dom'
import style from "../css/login.module.css"
import { AuthContext } from '../../context/AuthContext'
import URL from '../UI/URL'
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'

function Login() {
  const [userId, setUserId] = useState('') // Initialize as an empty string
  const [password, setPassword] = useState('')
  const [userError, setUserError] = useState({
    userId: "",
    password: "",
  })
  const [serverError, setServerError] = useState('')
  const { setLoggedUser, loggedUser } = useContext(AuthContext)
  const [showOpenNew, setShowEyedNew] = useState(false)

  const validateUsername = (userId) => {
    if (!userId) { // Check the actual userId, not setUserId
      return 'Username is required';
    }
    if (userId.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('');
    let errors = {};

    const usernameError = validateUsername(userId);
    if (usernameError) {
      errors.userId = usernameError; // Store the error in userId, not username
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    setUserError(errors);

    // Correctly check the error keys
    if (!errors.userId && !errors.password) {
      try {
        const response = await fetch(`${URL()}/user/`, {
          method: 'POST',
          body: JSON.stringify({ userId, password }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        const json = await response.json()

        if (response.ok) {
          setLoggedUser(json)
        } else {
          setServerError(json.error)
        }
      } catch (error) {
        setServerError(error.message)
      }
    }
  }

  const handleEyeNew = () => {
    setShowEyedNew((prev) => !prev);
  };

  if (loggedUser) {
    return <Navigate to='/' />
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
        <input
          type='text'
          value={userId}
          onChange={e => setUserId(e.target.value)}
          placeholder='UserId'
          style={{ backgroundColor: "white" }}
        />
        {userError.userId && <p style={{ color: 'red' }}>{userError.userId}</p>}
        <span className='w-full relative flex align-items-center'>
          <input
            type={showOpenNew ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="***************"
            style={{ backgroundColor: "white" }}
          />
          {showOpenNew ? (
            <IoIosEyeOff className='absolute cursor-pointer' style={{ right: '1rem' }} onClick={handleEyeNew} />
          ) : (
            <IoIosEye className='absolute' style={{ right: '1rem' }} onClick={handleEyeNew} />
          )}
        </span>

        {userError.password && <p style={{ color: 'red' }}>{userError.password}</p>}

        <button className={style.button} type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login
