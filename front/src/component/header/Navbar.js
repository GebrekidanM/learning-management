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
  },[])


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
    <div className={style.navContainer}>

      {/*Nav bar link*/}
      <div className={style.navBox}>
        <span><img src={logo} alt='nitsuh' className={style.logo}/></span>
        <Link to={'/'} className={style.navLink}>Home</Link>
        <Link to='/about' className={style.navLink}>About</Link>
        <Link to='/contact' className={style.navLink}>Contact</Link>
        <Link to='/blog' className={style.navLink}>Blog</Link>
      </div>
      
      {/*if loggedin or not*/}
      <div className={style.logBox}>
        {loggedUser?.username ? 
            <div className={style.username_logout}>
              <span className={style.userName} onClick={handleDashboard}>{loggedUser.username}</span>
              <div onClick={logout} style={{ marginRight: "2rem", cursor: "pointer", color: "red" }}>Logout</div>
              {showDashboard && <Link className={style.Dashbord} onClick={handleClickOnDashboard}> <MdDashboard/>  Dashboard</Link>}
            </div>
          :
            <Link to={'/login'} className={style.button}>Login</Link>}
      </div>
    </div>
  )
}

export default Navbar
