import React from 'react';
import { Box, Typography } from '@mui/material';

function ScheduleTitle() {
    return (
        <Box
            className={"scheduleTitle"}
            bgcolor={"#FFFFFF"}
            sx={{
                width: "100%", // Match the width of the parent container (timetable)
                maxWidth: "75rem", // Set the same maxWidth as the timetable
                border: "3px solid black",
                borderRadius: 7,
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                margin: "2rem auto", // Center horizontally
            }}
        >
            <Typography variant="h3" fontFamily={"Orelega One"}>Schedule</Typography>
        </Box>
    );
}

export default ScheduleTitle;
