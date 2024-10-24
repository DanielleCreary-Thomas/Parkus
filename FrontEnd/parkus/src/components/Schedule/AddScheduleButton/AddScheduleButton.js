import React, { useState, useEffect } from 'react';
import { Select, InputLabel, FormControl, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, MenuItem, Typography } from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../utils/supabase.ts';
import { fetchScheduleByScheduleId, fetchScheduleByUserAndDay, updateScheduleBlock, insertScheduleBlock, deleteScheduleBlock } from '../../../services/requests.js';

const dayToNumber = { 'Monday': '1', 'Tuesday': '2', 'Wednesday': '3', 'Thursday': '4', 'Friday': '5' };

const AddScheduleButton = ({ onSave, onDelete, selectedTime, selectedDay, isModalOpen, closeModal, isEdit, scheduleid }) => {
    const [description, setDescription] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedColor, setSelectedColor] = useState('#FF5733');
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');

    const colorOptions = [
        '#C5B6DD', '#A9B7C4', '#A2BBF3', '#8CD3D0',
        '#AEF1C8', '#E4DEA7', '#E9C8A8', '#D7B0AE'
    ];

    useEffect(() => {
        if (isModalOpen) {
            if (isEdit && scheduleid) {
                // Load existing schedule data when editing
                const fetchScheduleData = async () => {
                    try {
                        const response = await fetchScheduleByScheduleId(scheduleid);

                        // Log the response data for debugging
                        console.log("Fetched schedule data:", response);

                        if (response.error) {
                            toast.error('Error fetching schedule data: ' + response.error);
                            return;
                        }

                        if (response.scheduleblocks) {
                            const data = response.scheduleblocks[0]; // If the response returns an array

                            // Log data being set for debugging
                            console.log("Pre-loading data into modal:", data);

                            // Pre-load existing data into the form
                            setDescription(data.description);
                            setDayOfWeek(Object.keys(dayToNumber).find(key => dayToNumber[key] === data.dow)); // Convert numeric dow to day name
                            setStartTime(data.start_time ? data.start_time.toString() : '');
                            setEndTime(data.end_time ? data.end_time.toString() : '');
                            setSelectedColor(data.block_color);
                        }
                    } catch (error) {
                        toast.error('An error occurred while fetching schedule data.');
                        console.error("Fetch error:", error);
                    }
                };

                fetchScheduleData();
            } else {
                // Reset fields for adding a new schedule
                setDescription('');
                setStartTime(selectedTime || '');
                setEndTime('');
                setDayOfWeek(selectedDay || '');
                setSelectedColor('#FF5733');
            }
        }
    }, [isModalOpen, selectedTime, selectedDay, isEdit, scheduleid]);


    const generateTimeOptions = () => {
        const timeOptions = [];
        for (let hour = 7; hour <= 22; hour++) {
            const timeString = hour.toString().padStart(2, '0') + ':00';
            timeOptions.push(timeString);
        }
        return timeOptions;
    };

    const handleSave = async () => {
        if (!description || !startTime || !endTime || !dayOfWeek) {
            toast.error('Please provide all details.');
            return;
        }

        if (endTime <= startTime) {
            toast.error('End time must be after start time.');
            return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            toast.error('Error fetching user information.');
            return;
        }

        const userId = user.id;

        try {
            // Convert day name to number
            const numericDayOfWeek = dayToNumber[dayOfWeek];

            // Fetch existing schedule blocks for the same day of the week from backend API
            const existingBlocks = await fetchScheduleByUserAndDay(userId, numericDayOfWeek);

            // Convert times to Date objects for accurate comparison
            const newStartTime = new Date(`1970-01-01T${startTime}:00Z`);
            const newEndTime = new Date(`1970-01-01T${endTime}:00Z`);

            const hasOverlap = existingBlocks.some(block => {
                // Skip current block if editing
                if (block.scheduleid === scheduleid) return false;

                // Convert existing times to Date objects
                const existingStart = new Date(`1970-01-01T${block.start_time}Z`);
                const existingEnd = new Date(`1970-01-01T${block.end_time}Z`);

                // Check if the new time block overlaps with any existing block
                return (newStartTime < existingEnd && newEndTime > existingStart);
            });

            if (hasOverlap) {
                toast.error('The selected time overlaps with an existing block.');
                return;
            }

            let response;
            const scheduleData = {
                userid: userId,
                description,
                dow: numericDayOfWeek,
                start_time: startTime,
                end_time: endTime,
                block_color: selectedColor
            };
            if (isEdit && scheduleid) {
                // Update existing schedule block
                response = await updateScheduleBlock(scheduleid, scheduleData);
            } else {
                response = await insertScheduleBlock(scheduleData)
            }

            toast.success(isEdit ? 'Schedule block updated successfully!' : 'Schedule block added successfully!');
            onSave({ description, startTime, endTime, day: numericDayOfWeek, color: selectedColor });

            closeModal();
        } catch (error) {
            toast.error('An error occurred: ' + error.message);
        }
    };

    const handleDelete = async () => {
        if (!scheduleid) {
            toast.error('Error: Schedule ID not found.');
            return;
        }

        try {
            const result = await deleteScheduleBlock(scheduleid);

            if (result.error) {
                toast.error('Error deleting schedule block: ' + result.error);
                return;
            }

            toast.success('Schedule block deleted successfully!');
            setIsConfirmDeleteOpen(false);
            closeModal();
            onDelete();
        } catch (error) {
            toast.error('An error occurred: ' + error.message);
        }
    };

    const formatTime = (time) => {
        if (time && time.length === 8) { // supabase time format is 'hh:mm:ss'
            return time.slice(0, 5); // Take the first 5 characters (hh:mm)
        }
        return time;
    };

    return (
        <Box>
            <ToastContainer />
            {isEdit ? (
                <Dialog open={isModalOpen} onClose={closeModal}
                    PaperProps={{
                        style: {
                            marginLeft: '30%', // This adds the 70% margin to the left
                        }
                    }}>
                    <DialogTitle>
                        <Typography variant="h6" align="center">
                            Edit or Delete Schedule
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Stack direction="column" spacing={2}>
                            <TextField
                                label="Description"
                                fullWidth
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                InputLabelProps={{
                                    style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                }}
                            />
                            <FormControl fullWidth variant="outlined">
                                <InputLabel style={{ paddingTop: '0.5rem', fontSize: '1rem' }}>Day of the Week</InputLabel>
                                <Select
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(e.target.value)}
                                    label="Day of the Week"
                                >
                                    <MenuItem value={"Monday"}>Monday</MenuItem>
                                    <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
                                    <MenuItem value={"Wednesday"}>Wednesday</MenuItem>
                                    <MenuItem value={"Thursday"}>Thursday</MenuItem>
                                    <MenuItem value={"Friday"}>Friday</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Start Time"
                                fullWidth
                                variant="outlined"
                                select
                                value={formatTime(startTime)}
                                onChange={(e) => setStartTime(e.target.value)}
                                SelectProps={{
                                    MenuProps: {
                                        sx: {
                                            '.MuiMenuItem-root': {
                                                fontSize: '1rem',
                                            },
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                }}
                            >
                                {generateTimeOptions().map(time => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="End Time"
                                fullWidth
                                variant="outlined"
                                select
                                value={formatTime(endTime)}
                                onChange={(e) => setEndTime(e.target.value)}
                                SelectProps={{
                                    MenuProps: {
                                        sx: {
                                            '.MuiMenuItem-root': {
                                                fontSize: '1rem',
                                            },
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                }}
                            >
                                {generateTimeOptions().map(time => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                                {colorOptions.map(color => (
                                    <Box
                                        key={color}
                                        sx={{
                                            width: 30,
                                            height: 30,
                                            backgroundColor: color,
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            border: selectedColor === color ? '3px solid black' : 'none'
                                        }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsConfirmDeleteOpen(true)} color="secondary" variant="contained">
                            Delete
                        </Button>
                        <Button onClick={handleSave} color="primary" variant="contained">
                            Edit
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <Dialog
                    open={isModalOpen}
                    onClose={closeModal}
                    PaperProps={{
                        style: {
                            marginLeft: '30%', // This adds the 70% margin to the left
                        }
                    }}
                >
                    <DialogTitle>
                        <Typography variant="h6" align="center">
                            Add Schedule
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Stack direction="column" spacing={2}>
                            <TextField
                                label="Description"
                                fullWidth
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                InputLabelProps={{
                                    style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                }}
                            />
                            <FormControl fullWidth variant="outlined">
                                <InputLabel style={{ paddingTop: '0.5rem', fontSize: '1rem' }}>Day of the Week</InputLabel>
                                <Select
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(e.target.value)}
                                    label="Day of the Week"
                                >
                                    <MenuItem value={"Monday"}>Monday</MenuItem>
                                    <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
                                    <MenuItem value={"Wednesday"}>Wednesday</MenuItem>
                                    <MenuItem value={"Thursday"}>Thursday</MenuItem>
                                    <MenuItem value={"Friday"}>Friday</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Start Time"
                                fullWidth
                                variant="outlined"
                                select
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                }}
                            >
                                {generateTimeOptions().map(time => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="End Time"
                                fullWidth
                                variant="outlined"
                                select
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                }}
                            >
                                {generateTimeOptions().map(time => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                                {colorOptions.map(color => (
                                    <Box
                                        key={color}
                                        sx={{
                                            width: 30,
                                            height: 30,
                                            backgroundColor: color,
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            border: selectedColor === color ? '3px solid black' : 'none'
                                        }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary" variant="contained">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

            )}

            <Dialog open={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this schedule block?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsConfirmDeleteOpen(false)} color="secondary">
                        No
                    </Button>
                    <Button onClick={handleDelete} color="primary" variant="contained">
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddScheduleButton;