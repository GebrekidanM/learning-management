import React, { useContext} from 'react'
import { AuthContext } from '../../../context/AuthContext'
import URL from '../../UI/URL'
function TeacherDash() {
    const {loggedUser} = useContext(AuthContext)

console.log(loggedUser)
    
  return (
    <div>
        <div>
            <img src={`${URL()}/uploads/${loggedUser.teacherPhoto}`} alt={"teacher profile"}/>
        </div>
        <div></div>
    </div>
  )
}

export default TeacherDash
