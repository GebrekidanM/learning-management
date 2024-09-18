import React, { useContext } from 'react';
import { FaHome } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { toast ,ToastContainer} from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast
import URL from '../../UI/URL';

function AdminNav({ filterType }) {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const navigate = useNavigate()
  // Logout system
  const logout = async () => {
    try {
      const response = await fetch(`${URL()}/user/logout`, { credentials: "include" });
      if (response.ok) {
        setLoggedUser(null);
        toast.success('Logged out successfully!');
        navigate('/');
      } else {
        toast.error('Logout failed, please try again!'); 
      }
    } catch (error) {
      toast.error('An error occurred during logout!'); 
    }
  };

  return (
    <div className='sticky top-0 z-3 h-4rem w-full flex justify-content-between align-items-center' style={{ backgroundColor: "var(--card)" }}>
      <ToastContainer/>
      <div className='flex gap-8 flex-1 ml-3 align-items-center'>
        <Link to={'/'} className='text-2xl medium text-white'>{<FaHome />}</Link>
        <div className='text-2xl medium text-white cursor-pointer'>{<IoMenu />}</div>
      </div>
      <div className={'flex-auto text-white capitalize align-items-start text-center'}>
        {filterType ? <h1>{filterType}</h1> : <h1>Welcome {loggedUser.username || loggedUser.first || loggedUser.familyFirst}</h1>}
      </div>
      <div className='flex-1 text-2xl medium text-white cursor-pointer mr-3 text-right' onClick={logout}>{<CiLogout />}</div>
    </div>
  );
}

export default AdminNav;
