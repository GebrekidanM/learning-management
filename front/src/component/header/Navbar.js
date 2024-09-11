import React, { useContext, useEffect, useState } from 'react'
import logo from "../../asset/logo.png"
import style from "../css/Navbar.module.css"
import {Link, Navigate} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { MdDashboard } from "react-icons/md";
import URL from '../UI/URL'

function Navbar() {
  const { loggedUser,setLoggedUser } = useContext(AuthContext)
  const [ showDashboard,setShowDashboard] = useState(false)
  const [redirect,setRedirect] = useState(false)
  //create user for the first time
  useEffect(() => {
    const createNew = async()=>{
        await fetch(`${URL()}/user/createOne`,{credentials:"include"})
    }
    createNew()
  },[])

  //get information of the logged user
  useEffect(() => {
    const getInfo = async()=>{
        const response = await fetch(`${URL()}/user/profile`, {credentials:"include"})
        const json = await response.json()
        if(response.ok){
          setLoggedUser(json)
        }
    }
    getInfo()
  },[setLoggedUser])


// logout system
  const logout = async() => {
    const response = await fetch(`${URL()}/user/logout`, { credentials: "include" })
    if(response.ok){
      setLoggedUser('')
    }
  }

  const handleDashboard = ()=>{
    setShowDashboard(!showDashboard)
  }
  const handleClickOnDashboard = ()=>{
    setShowDashboard(!showDashboard)
    setRedirect(true)
  }

  if(redirect){
    return <Navigate to={'/main'} />
  }

  return (
    <div className={`${style.navContainer}`}>

      {/*Nav bar link*/}
      <div className={'flex gap-3 align-items-center'}>
        <span><img src={logo} alt='nitsuh' className={`ml-6 w-3rem h-3rem`}/></span>
        <Link to={'/'} className={style.navLink}>Home</Link>
        <Link to='/about' className={style.navLink}>About</Link>
        <Link to='/contact' className={style.navLink}>Contact</Link>
        <Link to='/blog' className={style.navLink}>Blog</Link>
      </div>
      
      {/*if loggedin or not*/}
      <div className={style.logBox}>
        {loggedUser?.username ? 
            <div className={'flex gap-3 align-items-center'}>
              <span className={'text-yellow-600 font-medium capitalize cursor-pointer p-2 z-5 transition-duration-500 hover:text-white'} onClick={handleDashboard}>{loggedUser.username}</span>
              <div onClick={logout} className='cursor-pointer text-red-600 hover:text-white hover:bg-red-600 py-2 px-3 transition-duration-500 border-round-xs font-medium'>Logout</div>
              {showDashboard && <Link style={{top:"4rem"}} className={`absolute p-2 right-0 w-11rem bg-cyan-900 text-white cursor-pointer no-underline transition-duration-500 hover:bg-yellow-700`} onClick={handleClickOnDashboard}> <MdDashboard/>  Dashboard</Link>}
            </div>
          :
            <Link to={'/login'} className={'button'}>Login</Link>}
      </div>
    </div>
  )
}

export default Navbar
