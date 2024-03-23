import './Navbar.css';
import {useNavigate } from "react-router-dom";
import {Box, Button, Stack, styled} from "@mui/material";
import AppTitle from "../AppTitle/AppTitle";

function Navbar() {
    const navigate = useNavigate();


    return (
        <Stack direction="column" className="navbar">
            {/*using link to replace anchor tag*/}
            <AppTitle></AppTitle>
            <Button className={"navbutton"} onClick={()=>{navigate("/")}}>Home</Button>
            <Button className={"navbutton"} onClick={()=>{navigate("/updateSchedule")}}>Schedule</Button>
            <Button className={"navbutton"} onClick={()=>{navigate("/spotSharing")}}>Spotsharing</Button>
            <Button className={"navbutton"} onClick={()=>{navigate("/payment")}}>Payment</Button>
            <Box height={450}></Box>
            <Button className={"signout"}>Signout</Button>
        </Stack>
    );
}

export default Navbar;
