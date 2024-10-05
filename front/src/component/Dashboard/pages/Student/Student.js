import React from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import GradeSectionSelector from '../Grade/GradeSectionSelector'
import Grade from '../Grade/Grade'

function Student({semesterId}) {

  const [searchParams] = useSearchParams()
  const stuType = searchParams.get('stuType')

//here to pull at the end of the current link
function generateNewSearchParams(key,value) {
  const type = new URLSearchParams(searchParams)
  type.set(key,value)
  return `?${type.toString()}`
}

  return (
    <div className={'mt-6'}>
        <Link 
            to={generateNewSearchParams('stuType','createStudent')}  
            className={'button float-right bg-white text-cyan-900 w-3 border-cyan-900 border-1 hover:bg-cyan-900 hover:text-white'}>Add new student</Link>
      <div>
        {stuType === 'createStudent' ?
            <GradeSectionSelector semesterId={semesterId}/>
          : <Grade semesterId={semesterId}/>
        }
      </div>
    </div>
  )
}

export default Student
