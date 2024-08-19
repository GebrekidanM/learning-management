import Navbar from "./component/header/Navbar";
import Login from "./component/pages/login";
import Signup from "./component/pages/signup";
import {Routes,Route,useLocation} from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";
import DashboardIs from "./component/Dashboard/DashboardIs";

function App () {

  return (
    <AuthProvider>
      <ConditionalNavbar />
      <Routes>
        <Route path={'/login'} element={<Login />}/>
        <Route path={'/signup'} element={<Signup />}/>
        <Route path={'/main'} element={<DashboardIs />}/>
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
