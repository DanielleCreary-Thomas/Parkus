import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import Schedule from "./pages/Schedule";
import SpotSharing from "./pages/SpotSharing";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Group from "./pages/Group"
import Layout from './components/Layout'; // Layout component with navbar
import ProtectedRoute from './components/ProtectedRoute/protectedRoute'; // Import ProtectedRoute

import GroupSchedule from './components/GroupSchedule/GroupSchedule';
import Settings from './pages/Settings'; 

function App() {
    return (
        <div>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected routes with Navbar */}
                <Route element={<Layout />}>
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/schedule" element={
                        <ProtectedRoute>
                            <Schedule />
                        </ProtectedRoute>
                    } />
                    <Route path="/spotSharing" element={
                        <ProtectedRoute>
                            <SpotSharing />
                        </ProtectedRoute>
                    } />
                    <Route path="/payment" element={
                        <ProtectedRoute>
                            <Payment />
                        </ProtectedRoute>
                    } />
                    <Route path="/group" element={
                        <ProtectedRoute>
                            <Group />
                        </ProtectedRoute>
                    } />
                    <Route path="/group-schedule/:groupId" element={
                        <ProtectedRoute>
                            <GroupSchedule />
                        </ProtectedRoute>
                    } />
                     <Route path="/settings" element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
