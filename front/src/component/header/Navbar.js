import React, { useContext, useEffect, useState } from 'react'
import logo from "../../asset/logo.png"
import style from "../css/Navbar.module.css"
import {Link} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'


function Navbar() {
  const [logged, setLogged] = useState()
  const { loggedUser } = useContext(AuthContext)

  useEffect(() => {
    const createNew = async()=>{
        const response = await fetch('http://localhost:4000/user/create')
        const json = await response.json()
        if (response.ok) {
            setLogged(json)
        }
    }
    createNew()
  },[])

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
        {logged ? <span>kidan</span>:<Link to={'/login'} className={style.button}>Login</Link>}
      </div>
    </div>
  )
}

export default Navbar
