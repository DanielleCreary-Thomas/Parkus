import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import UpdateSchedule from "./pages/UpdateSchedule";
import SpotSharing from "./pages/SpotSharing";
import Payment from "./pages/Payment";
 // Import the layout component
import Layout from './components/Layout';
import Profile from "./pages/Profile"
import Group from './pages/Group';

function App() {
    return (
        <div>
            <Routes>
                {/* Define all your routes here */}
                <Route path="/" element={<LandingPage />} /> {/* Landing page route */}
                <Route path="/signin" element={<SignIn />} /> {/* Sign In page */}
                <Route path="/signup" element={<SignUp />} /> {/* Sign Up page */}

                {/* Routes that require Navbar (authenticated routes) */}
                <Route element={<Layout />}>
                    {/* All these routes will have Navbar visible */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/updateSchedule" element={<UpdateSchedule />} />
                    <Route path="/spotSharing" element={<SpotSharing />} />
                    <Route path="/payment" element={<Payment />}/>
                    <Route path="/group" element={<Group />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
