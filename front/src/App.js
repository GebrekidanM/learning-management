import React, { useContext, useEffect, useState } from "react";
import Navbar from "./component/pages/Navbar";
import Login from "./component/pages/login";
import Signup from "./component/pages/signup";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import DashboardIs from "./component/Dashboard/DashboardIs";
import CreateSemester from "./component/Dashboard/CreateSemester";
import Home from "./component/pages/Home";
import LoadingIndicator from "./component/common/LoadingIndicator";

function App() {
  const [loading,setLoading] = useState(false)
  const {loggedUser} =useContext(AuthContext)

  useEffect(()=>{
    try {
      setLoading(true)
      if(loggedUser){
        setLoading(false)
      }else{
        setLoading(false)
      }
    } catch(error){
      console.log(error)
    }
  },[loggedUser])
  
  if(loading){
    return <LoadingIndicator/>
  }

  return  (
    <>
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       {/**protected routes */}
        <Route path="/create-semester" element={loggedUser ?<CreateSemester/>:<Login/>} />
        <Route path="/main" element={loggedUser ?<DashboardIs/>:<Login/>}/>
      </Routes>
    </>
  );
}

const ConditionalNavbar = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/main'];
  return !hideNavbarRoutes.includes(location.pathname) && <Navbar />;
};

export default App;
