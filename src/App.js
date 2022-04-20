import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Menu from "./components/Menu";
import LogIn from "./pages/LogIn";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Map from "./pages/Map";
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import EditProfile from "./pages/EditProfile";


function App() {
  return (
    <>
        <Router>
            <Menu/>
            <Routes>
                <Route path='/' element={<LogIn />} />
                <Route path='/register' element={<Register />} />
                <Route path='/map' element={<PrivateRoute />}>
                    <Route path='/map' element={<Map />} />
                </Route>

                <Route path='/profile' element={<PrivateRoute />}>
                    <Route path='/profile' element={<Profile />} />
                </Route>

                <Route path='/edit-profile' element={<PrivateRoute />}>
                    <Route path='/edit-profile' element={<EditProfile />} />
                </Route>

                <Route path='/forgot-password' element={<ForgotPassword />} />
            </Routes>

        </Router>
        <ToastContainer />
    </>
  );
}

export default App;
