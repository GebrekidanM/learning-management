import React from "react";
import Navbar from "./component/pages/Navbar";
import Login from "./component/pages/login";
import Signup from "./component/pages/signup";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import DashboardIs from "./component/Dashboard/DashboardIs";
import CreateSemester from "./component/Dashboard/CreateSemester";
import ProtectedRoute from "./component/ProtectedRoute";
import Home from "./component/pages/Home";

function App() {
  return (
    <AuthProvider>
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-semester" element={<ProtectedRoute element={CreateSemester} />} />
        <Route path="/main" element={<ProtectedRoute element={DashboardIs} />} />
      </Routes>
    </AuthProvider>
  );
}

const ConditionalNavbar = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/main'];

  return !hideNavbarRoutes.includes(location.pathname) && <Navbar />;
};

export default App;
