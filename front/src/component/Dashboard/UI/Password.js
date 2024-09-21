import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import URL from '../../UI/URL';
import { toast } from 'react-toastify';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

function PasswordChange({ handle, setHandle }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { loggedUser } = useContext(AuthContext);
  const [showOpenCurrent, setShowEyedCurrent] = useState(false);
  const [showOpenNew, setShowEyedNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${URL()}/teacher/password/${loggedUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success('Password updated successfully!');
      setHandle(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEyeCurrent = () => {
    setShowEyedCurrent((prev) => !prev);
  };

  const handleEyeNew = () => {
    setShowEyedNew((prev) => !prev);
  };

  return (
    <>
      <div
        className='absolute top-0 left-0 z-4 w-full h-full flex align-items-center justify-content-center'
        onClick={() => setHandle(!handle)}
        style={{ backgroundColor: '#000000bb' }}
      />
      <form
        onSubmit={handleSubmit}
        className='flex flex-column p-5 gap-3 z-5 fixed border-round-sm bg-white'
        style={{ top: '30vh', marginLeft: '25%' }}
      >
        <h3 className='text-center'>Change Password</h3>

        <div className='flex flex-column gap-2'>
          <label>Current Password:</label>
          <span className='relative flex align-items-center'>
            <input
              type={showOpenCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className='border-1 p-2'
            />
            {showOpenCurrent ? (
              <IoIosEyeOff className='absolute' style={{ right: '1rem' }} onClick={handleEyeCurrent} />
            ) : (
              <IoIosEye className='absolute' style={{ right: '1rem' }} onClick={handleEyeCurrent} />
            )}
          </span>
        </div>

        <div className='flex flex-column gap-2'>
          <label>New Password:</label>
          <span className='relative flex align-items-center'>
            <input
              type={showOpenNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='border-1 p-2'
            />
            {showOpenNew ? (
              <IoIosEyeOff className='absolute' style={{ right: '1rem' }} onClick={handleEyeNew} />
            ) : (
              <IoIosEye className='absolute' style={{ right: '1rem' }} onClick={handleEyeNew} />
            )}
          </span>
        </div>

        <button className='button'>Submit</button>
      </form>
    </>
  );
}

export default PasswordChange;
