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
            <Button className="navbutton"
                    onClick={() => { navigate("/home") }}
                    sx={{
                        fontFamily: "Orelega One",
                        fontSize: "20px",
                        }}
            >Home</Button>
            <Button className="navbutton"
                    onClick={() => { navigate("/profile") }}
                    sx={{
                        fontFamily: "Orelega One",
                        fontSize: "20px",
                    }}
            >Profile</Button>
            <Button className="navbutton"
                    onClick={() => { navigate("/schedule") }}
                    sx={{
                        fontFamily: "Orelega One",
                        fontSize: "20px",
                    }}
            >Schedule</Button>
            <Button className="navbutton"
                    onClick={() => { navigate("/spotSharing") }}
                    sx={{
                        fontFamily: "Orelega One",
                        fontSize: "20px",
                    }}
            >Spotsharing</Button>
            <Button className="navbutton"
                    onClick={() => { navigate("/payment") }}
                    sx={{
                        fontFamily: "Orelega One",
                        fontSize: "20px",
                    }}
            >Payment</Button>
            <Button className="navbutton"
                    onClick={() => { navigate("/group") }}
                    sx={{
                        fontFamily: "Orelega One",
                        fontSize: "20px",
                    }}
            >Group</Button>
            
            <Box sx={{ flexGrow: 1 }} /> {/* This will take up the remaining space and push signout button to the bottom */}
            <Button className="signout" onClick={handleSignout}>Signout</Button> {/* Added signout handler */}
        </Stack>
    );
}

export default Navbar;
