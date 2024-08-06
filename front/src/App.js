import Registeral from "./component/Dashboard/Registeral";
import Navbar from "./component/header/Navbar";
import Login from "./component/pages/login";
import Signup from "./component/pages/signup";
import {Routes,Route} from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";
function App () {
  return (
    <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path={'/login'} element={<Login/>}/>
        <Route path={'/signup'} element={<Signup/>}/>
        <Route path={'/register'} element={<Registeral/>}/>
      </Routes>     
    </AuthProvider>
   
  );
}

export default App;
