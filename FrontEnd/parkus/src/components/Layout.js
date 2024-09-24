// src/components/Layout.js
import React from 'react';
import Navbar from './SideNav/Navbar/Navbar';
import { Outlet } from 'react-router-dom'; // This will render the current page's component

function Layout() {
    return (
        <div className="app-container">
            {/* Navbar will always be displayed */}
            <div className="left-panel">
                <Navbar />
            </div>
            {/* Right panel will change based on the route */}
            <div className="right-panel">
                <Outlet /> {/* This is where the current route's component will be rendered */}
            </div>
        </div>
    );
}

export default Layout;
