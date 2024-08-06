import React, { useEffect, useState } from 'react'
import logo from "../../asset/logo.png"
import style from "../css/Navbar.module.css"
import {Link} from 'react-router-dom'


function Navbar() {
  const [logged, setLogged] = useState()

  useEffect(()=>{
    const createNew = async()=>{
        const response = await fetch('http://localhost:4000/user/create')
        const json = await response.json()
        if (response.ok) {
            console.log(json)   
        }
        
    }
    createNew()
  },[])

  return (
    <div className={style.navContainer}>
      <ul className={style.navBox}>
        <span><a><img src={logo} alt='nitsuh' className={style.logo}/></a></span>
        <Link to={'/'}>Home</Link>
        <Link>About</Link>
        <li>Contact</li>
        <Link to='/blog'>Blog</Link>
      </ul>
      <div className={style.logBox}>
        {logged ? <span>kidan</span>:<Link to={'/login'} className={style.button}>Login</Link>}
      </div>
    </div>
  )
}

export default Navbar
