import Navbar from "../components/SideNav/Navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import Home from "./Home";
import UpdateSchedule from "./UpdateSchedule";
import SpotSharing from "./SpotSharing";
import {Typography} from "@mui/material";
import React from "react";

function Payment() {
    return (

        <div className="app-container">
            <div className="left-panel">
            </div>
            <div className="right-panel">
                <Typography variant={"h3"}>Payment</Typography>
            </div>
        </div>
    )
}

export default Payment;