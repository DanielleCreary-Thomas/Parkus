import React, { useState } from 'react';
import { Box, IconButton, MenuItem, Select, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './AddTimeBlock.css';

const AddTimeBlock = ({ onSave }) => {
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [showEmptyWarning, setShowEmptyWarning] = useState(false);
    const [showEndTimeWarning, setShowEndTimeWarning] = useState(false);

    const handleDayChange = (event) => {
        setDay(event.target.value);
    };

    const handleStartTimeChange = (event) => {
        setStartTime(event.target.value);
    };

    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value);
    };

    const handleDelete = () => {

        if (!day || !startTime || !endTime) {
            // Display a warning for empty input
            setShowEmptyWarning(true);
            return;
        }

        // Check if end time is smaller than or equal to start time
        if (endTime <= startTime) {
            // Display a warning for invalid time range
            setShowEndTimeWarning(true);

        }
    };
    const handleSave = () => {
        // Check if any input field is empty
        if (!day || !startTime || !endTime) {
            // Display a warning for empty input
            setShowEmptyWarning(true);
            return;
        }

        // Check if end time is smaller than or equal to start time
        if (endTime <= startTime) {
            // Display a warning for invalid time range
            setShowEndTimeWarning(true);
            return;
        }

        // Check if the time block is duplicate
        const newTimeBlock = { day, startTime, endTime };
        onSave(newTimeBlock);
        // Reset input fields after saving
        setDay('');
        setStartTime('');
        setEndTime('');
    };

    const generateTimeOptions = () => {
        const timeOptions = [];
        for (let hour = 1; hour <= 24; hour++) {
            const timeString = hour.toString().padStart(2, '0') + ':00';
            timeOptions.push(<MenuItem key={timeString} value={timeString}>{timeString}</MenuItem>);
        }
        return timeOptions;
    };

    const handleCloseEmptyWarning = () => {
        setShowEmptyWarning(false);
    };

    const handleCloseEndTimeWarning = () => {
        setShowEndTimeWarning(false);
    };

    return (
        <Box>
            <Box className="formcontrol" bgcolor={"#FFFFFF"}
                 maxWidth={"75rem"}
                 sx={{
                     height:"auto",
                     minHeight: "5.75rem",
                     border:"3px solid black",
                     borderRadius: 7,
                     alignItems:"center",
                     display:"flex",
                     justifyContent:"center",
                     margin:"2rem", }}>
                <Stack direction="row" spacing={4} className="addTimeBlockSection">
                    <Typography variant={"h1"}>Add a time block</Typography>

                    <Select labelId="day-select" id="day-select" value={day} label="Day" onChange={handleDayChange}
                            style={{minWidth: 200}}>
                        <MenuItem value="Monday">Monday</MenuItem>
                        <MenuItem value="Tuesday">Tuesday</MenuItem>
                        <MenuItem value="Wednesday">Wednesday</MenuItem>
                        <MenuItem value="Thursday">Thursday</MenuItem>
                        <MenuItem value="Friday">Friday</MenuItem>
                    </Select>

                    <Select labelId="start-time-select" id="start-time-select" value={startTime} label="Start Time"
                            onChange={handleStartTimeChange} style={{minWidth: 200}}>
                        {generateTimeOptions()}
                    </Select>

                    <Select labelId="end-time-select" id="end-time-select" value={endTime} label="End Time"
                            onChange={handleEndTimeChange} style={{minWidth: 200}}>
                        {generateTimeOptions()}
                    </Select>

                    <IconButton aria-label={"Add"} size={"large"} onClick={handleSave}>
                        <AddIcon fontSize={"large"}/>
                    </IconButton>
                    <div></div>
                </Stack>


                {/* Warning dialogs */}
                <Dialog open={showEmptyWarning} onClose={handleCloseEmptyWarning}>
                    <DialogTitle>Empty Input</DialogTitle>
                    <DialogContent>
                        <p>Please fill in all fields.</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEmptyWarning} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showEndTimeWarning} onClose={handleCloseEndTimeWarning}>
                    <DialogTitle>Invalid Time Range</DialogTitle>
                    <DialogContent>
                        <p>The end time cannot be smaller than or equal to the start time.</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEndTimeWarning} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box className="formcontrol" bgcolor={"#FFFFFF"}
                 maxWidth={"75rem"}
                 sx={{
                     height:"auto",
                     minHeight: "5.75rem",
                     border:"3px solid black",
                     borderRadius: 7,
                     alignItems:"center",
                     display:"flex",
                     justifyContent:"center",
                     margin:"2rem", }}>
                <Stack direction="row" spacing={4} className="deleteTimeBlockSection">
                    <Typography variant={"h1"}>Delete a time block</Typography>

                    <Select labelId="day-select" id="day-select" value={day} label="Day" onChange={handleDayChange} style={{minWidth:200}}>
                        <MenuItem value="Monday">Monday</MenuItem>
                        <MenuItem value="Tuesday">Tuesday</MenuItem>
                        <MenuItem value="Wednesday">Wednesday</MenuItem>
                        <MenuItem value="Thursday">Thursday</MenuItem>
                        <MenuItem value="Friday">Friday</MenuItem>
                    </Select>

                    <Select labelId="start-time-select" id="start-time-select" value={startTime} label="Start Time" onChange={handleStartTimeChange} style={{minWidth:200}}>
                        {generateTimeOptions()}
                    </Select>

                    <Select labelId="end-time-select" id="end-time-select" value={endTime} label="End Time" onChange={handleEndTimeChange} style={{minWidth:200}}>
                        {generateTimeOptions()}
                    </Select>

                    <IconButton aria-label={"Delete"} size={"large"} onClick={handleDelete}>
                        <RemoveIcon fontSize={"large"} />
                    </IconButton>
                    <div></div>
                </Stack>



                {/* Warning dialogs */}
                <Dialog open={showEmptyWarning} onClose={handleCloseEmptyWarning}>
                    <DialogTitle>Empty Input</DialogTitle>
                    <DialogContent>
                        <p>Please fill in all fields.</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEmptyWarning} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showEndTimeWarning} onClose={handleCloseEndTimeWarning}>
                    <DialogTitle>Invalid Time Range</DialogTitle>
                    <DialogContent>
                        <p>The end time cannot be smaller than or equal to the start time.</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEndTimeWarning} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

        </Box>
    );
};

export default AddTimeBlock;