import React, { useContext, useEffect, useState } from "react";
import Navbar from "./component/pages/Navbar";
import Login from "./component/pages/login";
import Signup from "./component/pages/signup";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import DashboardIs from "./component/Dashboard/DashboardIs";
import CreateSemester from "./component/Dashboard/CreateSemester";
import Home from "./component/pages/Home";
import LoadingIndicator from "./component/common/LoadingIndicator";

function App() {
  const [loading, setLoading] = useState(true);
  const { loggedUser, checkAuth } = useContext(AuthContext); // Assume `checkAuth` checks cookies for logged in status

  useEffect(() => {
    const verifyUser = async () => {
      await checkAuth();
      setLoading(false);
    };
    
    verifyUser();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected Routes */}
        <Route path="/create-semester" element={loggedUser ? <CreateSemester /> : <Navigate to="/login" />} />
        <Route path="/main" element={loggedUser ? <DashboardIs /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

const ConditionalNavbar = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/main"]; // You can hide Navbar on more routes if needed
  return !hideNavbarRoutes.includes(location.pathname) && <Navbar />;
};

export default App;
