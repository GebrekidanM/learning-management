import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { MdDashboard } from "react-icons/md";
import logo from "../../asset/logo.png";
import URL from '../UI/URL';

function Navbar() {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const [showDashboard, setShowDashboard] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const location = useLocation();


  useEffect(() => {
    const createNewUser = async () => {
      try {
        await fetch(`${URL()}/user/createOne`, { credentials: "include" });
      } catch (error) {
        console.error('Error creating new user:', error);
      }
    };
    createNewUser();
  }, []);

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

  const handleDashboardToggle = () => setShowDashboard((prev) => !prev);

  if (redirect) {
    return <Navigate to='/main' />;
  }

  const isActive = (path) => location.pathname === path ? 'text-yellow-700 border-yellow-700 border-solid' : '';
  return (
    <nav className={`fixed top-0 w-full flex justify-between items-center p-4 shadow-md z-10 h-16 bg-cyan-950`}>
      <div className='flex gap-4 items-center'>
        <Link to='/'>
          <img src={logo} alt='Logo' className='w-12 h-12' />
        </Link>
        <Link 
          to='/' 
          className={`border-b border-hidden no-underline text-lg font-md px-2 rounded-2 transition duration-500 hover:text-yellow-700 cursor-pointer ${isActive('/')}`}
          style={{ color: location.pathname === '/' ? 'text-yellow-700' : '#ffffff' }}>Home</Link>
        <Link 
          to='/about' 
          style={{ color: location.pathname === '/' ? 'text-yellow-700' : '#ffffff' }}
          className={`border-b border-hidden no-underline text-lg font-md px-2 rounded-2 transition duration-500 hover:text-yellow-700 cursor-pointer  ${isActive('/about')}`}>About</Link>
        <Link 
          to='/contact' 
          style={{ color: location.pathname === '/' ? 'text-yellow-700' : '#ffffff' }}
          className={`border-b border-hidden no-underline text-lg font-md px-2 rounded-2 transition duration-500 hover:text-yellow-700 cursor-pointer  ${isActive('/contact')}`}>Contact</Link>
        <Link 
          to='/blog' 
          style={{ color: location.pathname === '/' ? 'text-yellow-700' : '#ffffff' }}
          className={`border-b border-hidden no-underline text-lg font-md px-2 rounded-2 transition duration-500 hover:text-yellow-700 cursor-pointer  ${isActive('/blog')}`}>Blog</Link>
      </div>

      <div className='flex items-center gap-4'>
        {loggedUser ? (
          <div className='flex items-center gap-3'>
            <span
              onClick={handleDashboardToggle}
              className='text-yellow-600 font-medium capitalize cursor-pointer transition duration-300 hover:text-white'
            >
              {loggedUser.username || loggedUser.first || loggedUser.familyFirst}
            </span>
            <button
              onClick={logout}
              className='text-red-600 hover:text-white bg-transparent hover:bg-red-600 py-2 px-3 transition duration-300 rounded font-medium'
            >
              Logout
            </button>
            {showDashboard && (
              <Link
                to='/main'
                className='absolute top-16 right-0 p-2 w-44 bg-cyan-900 text-white flex items-center gap-2 rounded transition duration-300 hover:bg-yellow-700'
                onClick={() => setRedirect(true)}
              >
                <MdDashboard /> Dashboard
              </Link>
            )}
          </div>
        ) : (
          <Link to='/login' className='button'>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
