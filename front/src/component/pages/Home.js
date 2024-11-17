import React, { useContext } from 'react'
import logo from '../../asset/logo.png'
import { AuthContext } from '../../context/AuthContext';

function Home() {
  const {loggedUser} = useContext(AuthContext)
  return (
    <div className='w-full p-6  mt-8 flex justify-evenly items-center'>
         <div className='flex flex-col gap-8'>
            <div>
                <h1 className='text-4xl font-bold text-cyan-950'>Kidan Primary School</h1>
                <h1 className='font-bold text-yellow-700'>Building a Generation That Transcends</h1>
            </div>
            {!loggedUser && <button className='button border-2 bg-white border-cyan-900 hover:bg-cyan-900 hover:text-white'>Apply Now</button>}
         </div>
         <div className="right">
            <img src={logo} alt='kidan primary school' className='size-96 '/>
         </div>
    </div>
  )
}

export default Home;