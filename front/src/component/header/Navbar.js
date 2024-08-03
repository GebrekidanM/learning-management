import React, { useState } from 'react'
import logo from "../../asset/logo.png"
import style from "../css/Navbar.module.css"
function Navbar() {
  const [logged, setLogged] = useState()

  return (
    <div className={style.navContainer}>
      <ul className={style.navBox}>
        <span><a><img src={logo} alt='nitsuh' className={style.logo}/></a></span>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
        <li>Blog</li>
      </ul>
      <div className={style.logBox}>
        {logged ? <span>kidan</span>:<span className={style.button}>Login</span>}
      </div>
    </div>
  )
}

export default Navbar
