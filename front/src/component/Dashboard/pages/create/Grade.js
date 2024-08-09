import React from 'react'

function Grade({Male,Female,grade}) {
  return (
    <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
      <h2>Grade {grade}</h2>  <p>M: {Male}</p>  <p>F: {Female}</p> <p>Total: {Male + Female}</p>  
    </div>
  )
}

export default Grade
