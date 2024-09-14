import React,{useContext} from 'react'
import { FaHome } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { Link } from 'react-router-dom';
import {AuthContext} from '../../../context/AuthContext'

function AdminNav({filterType}) {
  const {loggedUser} = useContext(AuthContext)
  return (
    <div className='sticky top-0 z-5 h-4rem w-full flex justify-content-between align-items-center' style={{backgroundColor:"var(--card)"}}>
      <div className='flex gap-8 flex-1 ml-3 align-items-center'>
        <Link to={'/'} className='text-2xl medium text-white'>{<FaHome/>}</Link>
        <div className='text-2xl medium text-white cursor-pointer'>{<IoMenu/>}</div>
      </div>
      <div className={'flex-auto text-white capitalize align-items-start'}>
        {filterType? <h1>{filterType}</h1> : <h1>Welcome {loggedUser.username||loggedUser.first||loggedUser.familyFirst}</h1> }
      </div>
    </div>
  )
}

export default AdminNav
