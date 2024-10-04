// App.js

import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import UpdateSchedule from "./pages/UpdateSchedule";
import SpotSharing from "./pages/SpotSharing";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Layout from './components/Layout';
import Group from './pages/Group';
import GroupSchedule from './components/GroupSchedule/GroupSchedule';

function App() {
    return (
        <div>
            <Routes>
                {/* Landing page route */}
                <Route path="/" element={<LandingPage />} />
                {/* Authentication pages */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Routes that require Navbar (authenticated routes) */}
                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/updateSchedule" element={<UpdateSchedule />} />
                    <Route path="/spotSharing" element={<SpotSharing />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/group" element={<Group />} />
                    <Route path="/group-schedule/:groupId" element={<GroupSchedule />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
