import React from 'react';
import { Box, Typography } from '@mui/material';
// import './ScheduleTitle.css';

function ScheduleTitle() {
    return (
        <Box
            className={"scheduleTitle"}
            bgcolor={"#FFFFFF"}
            maxWidth={"75rem"}

            sx={{
                border:"3px solid black",
                borderRadius: 7,
                alignItems:"center",
                display:"flex",
                justifyContent:"center",
                margin:"2rem",
            }}
        >

                <Typography variant="h1" fontFamily={"Orelega One"}>Schedule</Typography>

        </Box>
    );
}

export default ScheduleTitle;
