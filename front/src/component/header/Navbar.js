import React, { useContext, useEffect, useState } from 'react'
import logo from "../../asset/logo.png"
import style from "../css/Navbar.module.css"
import {Link} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'


function Navbar() {
  const { loggedUser,setLoggedUser } = useContext(AuthContext)

  useEffect(() => {
    const createNew = async()=>{
        await fetch('http://localhost:4000/user/create',{credentials:"include"})
    }
    createNew()
  },[])

  useEffect(() => {
    const getInfo = async()=>{
        const response = await fetch('http://localhost:4000/user/profile', {credentials:"include"})
        const json = await response.json()
        if(response.ok){
          setLoggedUser(json)
        }
    }
    getInfo()
  },[])


  const logout = async() => {
    const response = await fetch("http://localhost:4000/user/logout", { credentials: "include" })
    if(response.ok){
      setLoggedUser('')
    }
  }


  return (
    <div className={style.navContainer}>
      <div className={style.navBox}>
        <span><img src={logo} alt='nitsuh' className={style.logo}/></span>
        <Link to={'/'} className={style.navLink}>Home</Link>
        <Link to='/about' className={style.navLink}>About</Link>
        <Link to='/contact' className={style.navLink}>Contact</Link>
        <Link to='/blog' className={style.navLink}>Blog</Link>
      </div>
      <div className={style.logBox}>
        {loggedUser ? 
            <div className={style.username_logout}>
              <span className={style.userName}>{loggedUser.username}</span>
              <div onClick={logout} style={{ marginRight: "2rem", cursor: "pointer", color: "red" }}>Logout</div>
            </div>
          :
            <Link to={'/login'} className={style.button}>Login</Link>}
      </div>
    </div>
  )
}

export default Navbar
