import React from 'react'
import style from "../css/Dashbord.module.css"
import Navbar from '../header/Navbar'
import {useLocation} from 'react-router-dom' 

function Admin() {
  const [ tab, setTab ] = useState("")
  const location = useLocation()
    
  //get tabs
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const getUrl = urlParams.get('tab')
    setTab(getUrl)
}, [ location.search ])
  return (
    <div className={style.dash}>
      <Navbar/>
      Hello
    </div>
  )
}

export default Admin
