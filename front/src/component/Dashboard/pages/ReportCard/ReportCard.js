import { Card } from 'primereact/card'
import React, { useEffect } from 'react'

function ReportCard({studentId}) {

    useEffect(()=>{

    },[studentId])
  return (
    <Card className='w-full mt-3'>
        <div>
            <div>
            <span>
                <h2>Nitsuh Primary School</h2>
                <p>Pure wisdom with pure method</p>
            </span>
                
            </div>
            <div></div>
        </div>     
    </Card>
  )
}

export default ReportCard
