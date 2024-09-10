import React, { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import Navbar from "../components/SideNav/Navbar/Navbar";
import { supabase } from '../utils/supabase.ts';

function Home() {
    const [userData, setUserData] = useState(null); // State to store user data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Function to fetch user data
        const fetchUserData = async () => {
            // Fetch the authenticated user from Supabase Auth
            const {
                data: { user },
                error
            } = await supabase.auth.getUser();

            if (error) {
                console.error('Error fetching authenticated user:', error);
                return;
            }

            if (user) {
                // Query the 'users' table for additional user details using the UUID
                const { data, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('userid', user.id)
                    .single(); // We use .single() because we expect one user to be returned

                if (userError) {
                    console.error('Error fetching user data:', userError);
                } else {
                    setUserData(data); // Set the fetched user data in the state
                }
            }
            setLoading(false); // Set loading to false after fetching data
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>; // Show a loading state while fetching data
    }

    if (!userData) {
        return <Typography variant="h6">No user data available</Typography>; // Handle case when no user data is found
    }

    return (
        <div className="app-container">
            <div className="left-panel">
            </div>
            <div className="right-panel">
                <Typography variant="h3">Home</Typography>
                <Typography variant="h6">User Details:</Typography>
                <ul>
                    <li><strong>UUID:</strong> {userData.userid}</li>
                    <li><strong>Group ID:</strong> {userData.groupid || 'N/A'}</li>
                    <li><strong>First Name:</strong> {userData.first_name}</li>
                    <li><strong>Last Name:</strong> {userData.last_name}</li>
                    <li><strong>Student ID:</strong> {userData.studentid}</li>
                    <li><strong>Phone Number:</strong> {userData.phone_number}</li>
                    <li><strong>Email:</strong> {userData.email}</li>
                    <li><strong>License Plate Number:</strong> {userData.license_plate_number}</li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
