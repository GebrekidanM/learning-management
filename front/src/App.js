import Navbar from "./component/header/Navbar";
import Login from "./component/pages/login";
import Signup from "./component/pages/signup";
import {Routes,Route,useLocation, useSearchParams} from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";
import DashboardIs from "./component/Dashboard/DashboardIs";
import Error from "./component/UI/Error";

function App () {
  const [searchParams] = useSearchParams()
  const error = searchParams.get('error')

  return (
    <AuthProvider>
      <ConditionalNavbar />
      <Routes>
        <Route path={'/login'} element={<Login />}/>
        <Route path={'/signup'} element={<Signup />}/>
        <Route path={'/main'} element={<DashboardIs />}/>
        <Route component={() => <Error errorCode="500" />} />
      </Routes>
    </AuthProvider>
  );
}

const ConditionalNavbar = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/main','/error'];

  return !hideNavbarRoutes.includes(location.pathname) && <Navbar />;
};

export default App;
