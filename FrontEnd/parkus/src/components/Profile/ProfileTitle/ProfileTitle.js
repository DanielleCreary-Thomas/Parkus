import React from 'react';
import { Box, Typography } from '@mui/material';

function ProfileTitle() {
    return (
        <Box
            className={"profileTitle"}
            bgcolor={"#FFFFFF"}
            sx={{
                width: "90%", 
                maxWidth: "75rem", 
                border: "3px solid black",
                borderRadius: 7,
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                margin: "2rem auto", // Center horizontally
            }}
        >
            <Typography variant="h3" fontFamily={"Orelega One"}>Profile</Typography>
        </Box>
    );
}

export default ProfileTitle;
