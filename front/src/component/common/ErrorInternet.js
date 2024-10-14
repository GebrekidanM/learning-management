import React from 'react'
import { FaSadTear } from "react-icons/fa";
function ErrorInternet({error}) {
    const handleRefresh = () => {
        window.location.reload(); // This reloads the current page
      };
    
  return (
        <div className='w-full h-screen flex flex-col gap-3 justify-center items-center'>
            <FaSadTear className='w-20 h-20 text-yellow-700'/>
            <p className='text-cyan-900 font-bold'>{error}</p>
            <button onClick={handleRefresh} className='button border-none bg-cyan-900 text-white hover:bg-white hover:text-cyan-900'>Refresh</button>
        </div>
    );
}

export default ErrorInternet
