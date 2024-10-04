import './Navbar.css';
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack } from "@mui/material";
import AppTitle from "../AppTitle/AppTitle";
import { supabase } from "../../../utils/supabase.ts"; // Adjust the path as per your project structure

function Navbar() {
    const navigate = useNavigate();

    const handleSignout = async () => {
        const { error } = await supabase.auth.signOut(); // Sign out the user
        if (error) {
            console.log('Error signing out:', error.message);
        } else {
            // Redirect to the sign-in page after logging out
            navigate("/signin");
        }
    };

    return (
        <Stack direction="column" className="navbar">
            {/* Using link to replace anchor tag */}
            <AppTitle />
            <Button className="navbutton" onClick={() => { navigate("/home") }}>Home</Button>
            <Button className="navbutton" onClick={() => { navigate("/profile") }}>Profile</Button>
            <Button className="navbutton" onClick={() => { navigate("/schedule") }}>Schedule</Button>
            <Button className="navbutton" onClick={() => { navigate("/spotSharing") }}>Spotsharing</Button>
            <Button className="navbutton" onClick={() => { navigate("/payment") }}>Payment</Button>
            <Button className="navbutton" onClick={() => { navigate("/group") }}>Group</Button>
            
            <Box sx={{ flexGrow: 1 }} /> {/* This will take up the remaining space and push signout button to the bottom */}
            <Button className="signout" onClick={handleSignout}>Signout</Button> {/* Added signout handler */}
        </Stack>
    );
}

export default Navbar;
