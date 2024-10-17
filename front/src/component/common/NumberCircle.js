import React from 'react'

function NumberCircle({number,name}) {
  return (
    <div className='text-center'>
        <div className='border-8 rounded-full border-yellow-700 numberCircle font-bold text-2xl flex items-center justify-center mb-2'>
            {number}
        </div>
        <p className='font-bold'>{name}</p>
    </div>
  )
}

export default NumberCircle
