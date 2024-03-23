import './App.css';
import AppTitle from "./components/SideNav/AppTitle/AppTitle";
import Navbar from "./components/SideNav/Navbar/Navbar"; // Assuming you have a CSS file for styling
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home";
import UpdateSchedule from "./pages/UpdateSchedule";
import SpotSharing from "./pages/SpotSharing";
import Payment from "./pages/Payment";
import {Button, CssBaseline} from "@mui/material";

export default function App() {
    return (

        <div className="app-container">
            <div className="left-panel">
                <Navbar/>
            </div>
            <div className="right-panel">
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/updateSchedule" element={<UpdateSchedule/>}></Route>
                    <Route path="/spotSharing" element={<SpotSharing/>}></Route>
                    <Route path="/payment" element={<Payment/>}></Route>
                </Routes>
            </div>
        </div>
    )
}