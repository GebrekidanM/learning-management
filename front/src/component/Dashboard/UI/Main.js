import React, { useContext, useEffect, useState} from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../../context/AuthContext';
import URL from '../../UI/URL';
import NumberCircle from '../../common/NumberCircle';
import NumberOfStudent from '../pages/Grade/NumberofStudent'
function Main({year}) {
  const {loggedUser} = useContext(AuthContext)
  const [numberOfStudent,setNumberOfStudent] = useState(null)
  const [numberOfSection,setNumberOfSection] = useState(null)
  const [numberOfTeacher,setNumberOfTeacher] = useState(null)
  const [numberOfParent,setNumberOfParent] = useState(null)

  const [error,setError] = useState('')

  useEffect(()=>{
    const fetchStudentNumber = async()=>{
      try {
        const response = await fetch(`${URL()}/students/amountStu/number`)
        const json = await response.json()
        if(response.ok){
          setNumberOfStudent(json)
        }else{
          setError(json.error)
        }
      } catch (error) {
        setError(error.message)
      }
    }
    fetchStudentNumber()
  },[])

  useEffect(()=>{
    const fetchSectionNumber = async()=>{
      try {
        const response = await fetch(`${URL()}/class/sections/number/all`)
        const json = await response.json()
        if(response.ok){
          setNumberOfSection(json)
        }else{
          setError(json.error)
        }
      } catch (error) {
        setError(error.message)
      }
    }
    fetchSectionNumber()
  },[])

  useEffect(()=>{
    const fetchTeacherNumber = async()=>{
      try {
        const response = await fetch(`${URL()}/teacher/number/all`)
        const json = await response.json()
        if(response.ok){
          setNumberOfTeacher(json)
        }else{
          setError(json.error)
        }
      } catch (error) {
        setError(error.message)
      }
    }
    fetchTeacherNumber()
  },[])

  useEffect(()=>{
    const fetchParentNumber = async()=>{
      try {
        const response = await fetch(`${URL()}/parent/number/all`)
        const json = await response.json()
        if(response.ok){
          setNumberOfParent(json)
        }else{
          setError(json.error)
        }
      } catch (error) {
        setError(error.message)
      }
    }
    fetchParentNumber()
  },[])

  const heightOfBar = (number)=>{
    const height = (number*100)/numberOfStudent?.totalStudents
    return height;
  }

  return loggedUser && (
    <div className='w-full mt-4'>
      <div className='w-full flex justify-between items-center'>
        <NumberCircle number={numberOfParent} name={'Parents'}/>
        <NumberCircle number={numberOfStudent?.totalStudents} name={'Students'}/>
        <NumberCircle number={numberOfTeacher} name={'Teachers'}/>
        <NumberCircle number={numberOfSection} name={'Sections'}/>
      </div>
      <NumberOfStudent/>
      <div className='flex gap-4 items-end'>
        <div className='border-2 bg-yellow-700' style={{width:'16px',height:`${heightOfBar(numberOfStudent?.totalStudents)}px`}}>
            <div className='bg-yellow-700' style={{width:'100%',height:`${heightOfBar(numberOfStudent?.male)}px`}}></div>
        </div>
        <div className='border-2 bg-yellow-700' style={{width:'16px',height:`${heightOfBar(numberOfStudent?.totalStudents)}px`}}>
            <div className='bg-yellow-700' style={{width:'100%',height:`${heightOfBar(numberOfStudent?.female)}px`}}></div>
        </div>
      </div>
    </div>
    
  )
}

export default Main
