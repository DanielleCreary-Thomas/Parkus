import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, MenuItem, Typography } from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../utils/supabase.ts';

const dayToNumber = { 'Monday': '1', 'Tuesday': '2', 'Wednesday': '3', 'Thursday': '4', 'Friday': '5' };

const AddScheduleButton = ({ onSave, onDelete, selectedTime, selectedDay, isModalOpen, closeModal, isEdit, scheduleid }) => {
    const [description, setDescription] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedColor, setSelectedColor] = useState('#FF5733');
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');

    const colorOptions = [
        '#FF5733', '#33FF57', '#3357FF', '#F1C40F',
        '#8E44AD', '#E67E22', '#1ABC9C', '#2C3E50'
    ];

    useEffect(() => {
        if (isModalOpen) {
            if (isEdit && scheduleid) {
                // Load existing schedule data when editing
                const fetchScheduleData = async () => {
                    const { data, error } = await supabase
                        .from('schedule_blocks')
                        .select('*')
                        .eq('scheduleid', scheduleid)
                        .single();

                    if (error) {
                        toast.error('Error fetching schedule data: ' + error.message);
                        return;
                    }

                    if (data) {
                        // Pre-load existing data
                        setDescription(data.description);
                        setDayOfWeek(Object.keys(dayToNumber).find(key => dayToNumber[key] === data.dow)); // Convert numeric dow to day name
                        setStartTime(data.start_time ? data.start_time.toString() : ''); // Ensure it matches dropdown format
                        setEndTime(data.end_time ? data.end_time.toString() : ''); // Ensure it matches dropdown format
                        setSelectedColor(data.block_color);
                    }
                };

                fetchScheduleData();
            } else {
                // Reset fields for adding a new schedule
                setDescription('');
                setStartTime(selectedTime || ''); // Set start time from props
                setEndTime('');
                setDayOfWeek(selectedDay || ''); // Keep day as string here for display purposes
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
            
            // Fetch existing schedule blocks for the same day of the week
            const { data: existingBlocks, error: fetchError } = await supabase
                .from('schedule_blocks')
                .select('*')
                .eq('userid', userId)
                .eq('dow', numericDayOfWeek); // Use numeric day of the week
    
            if (fetchError) {
                toast.error('Error fetching existing schedule blocks: ' + fetchError.message);
                return;
            }
    
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
                return (
                    (newStartTime < existingEnd && newEndTime > existingStart)
                );
            });
    
            if (hasOverlap) {
                toast.error('The selected time overlaps with an existing block.');
                return;
            }
    
            let supabaseResponse;
            if (isEdit && scheduleid) {
                // Update existing schedule block
                supabaseResponse = await supabase
                    .from('schedule_blocks')
                    .update({
                        description,
                        dow: numericDayOfWeek, 
                        start_time: startTime,
                        end_time: endTime,
                        block_color: selectedColor
                    })
                    .eq('scheduleid', scheduleid);
            } else {
                supabaseResponse = await supabase
                    .from('schedule_blocks')
                    .insert([{
                        userid: userId,
                        description,
                        dow: numericDayOfWeek, 
                        start_time: startTime,
                        end_time: endTime,
                        block_color: selectedColor
                    }]);
            }
    
            const { error: supabaseError } = supabaseResponse;
    
            if (supabaseError) {
                toast.error('Error saving schedule block: ' + supabaseError.message);
                return;
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
            const { error } = await supabase
                .from('schedule_blocks')
                .delete()
                .eq('scheduleid', scheduleid);

            if (error) {
                toast.error('Error deleting schedule block: ' + error.message);
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
                <Dialog open={isModalOpen} onClose={closeModal}>
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
                            <TextField
                                label="Day of the Week"
                                fullWidth
                                variant="outlined"
                                value={dayOfWeek}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                                InputLabelProps={{
                                    style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                }}
                            />
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
                <Dialog open={isModalOpen} onClose={closeModal}>
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
                            <TextField
                                label="Day of the Week"
                                fullWidth
                                variant="outlined"
                                value={dayOfWeek}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                                InputLabelProps={{
                                    style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                }}
                            />
                            <TextField
                                label="Start Time"
                                fullWidth
                                variant="outlined"
                                select
                                value={startTime}
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
                                value={endTime}
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
