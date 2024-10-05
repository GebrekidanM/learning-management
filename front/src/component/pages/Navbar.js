import React, { useContext, useEffect, useState } from 'react';
import logo from "../../asset/logo.png";
import style from "../css/Navbar.module.css";
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { MdDashboard } from "react-icons/md";
import URL from '../UI/URL';

function Navbar() {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const [showDashboard, setShowDashboard] = useState(false);
  const [redirect, setRedirect] = useState(false);

  // Create user for the first time (if needed)
  useEffect(() => {
    const createNew = async () => {
      try {
        await fetch(`${URL()}/user/createOne`, { credentials: "include" });
      } catch (error) {
        console.error('Error creating new user:', error);
      }
    };
    createNew();
  }, []);
  

  // Logout system
  const logout = async () => {
    try {
      const response = await fetch(`${URL()}/user/logout`, { credentials: "include" });
      if (response.ok) {
        setLoggedUser(null);
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const handleClickOnDashboard = () => {
    setShowDashboard(false);
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to={'/main'} />;
  }

  return (
    <div className={`${style.navContainer}`}>
      {/* Navbar Links */}
      <div className='flex gap-3 align-items-center'>
        <span><img src={logo} alt='nitsuh' className='ml-6 w-3rem h-3rem' /></span>
        <Link to='/' className={style.navLink}>Home</Link>
        <Link to='/about' className={style.navLink}>About</Link>
        <Link to='/contact' className={style.navLink}>Contact</Link>
        <Link to='/blog' className={style.navLink}>Blog</Link>
      </div>

      {/* Logged-in User or Login Link */}
      <div className={style.logBox}>
        {loggedUser?
          <div className='flex gap-3 align-items-center'>
            <span className='text-yellow-600 font-medium capitalize cursor-pointer p-2 z-5 transition-duration-500 hover:text-white' onClick={handleDashboard}>{loggedUser.username || loggedUser.first || loggedUser.familyFirst}</span>
            <div onClick={logout} className='cursor-pointer text-red-600 hover:text-white hover:bg-red-600 py-2 px-3 transition-duration-500 border-round-xs font-medium'>Logout</div>
            {showDashboard && <Link style={{top:"4rem"}} className='absolute p-2 right-0 w-11rem bg-cyan-900 text-white cursor-pointer no-underline transition-duration-500 hover:bg-yellow-700 flex gap-3 items-center' onClick={handleClickOnDashboard}><MdDashboard/> Dashboard</Link>}
          </div>
          :
          <Link to='/login' className='button'>Login</Link>
        }
      </div>
    </div>
  );
}

export default Navbar;
