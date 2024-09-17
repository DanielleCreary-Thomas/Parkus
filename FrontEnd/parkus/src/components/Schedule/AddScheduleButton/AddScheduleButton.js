import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, MenuItem } from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../utils/supabase.ts';

const AddScheduleButton = ({ onSave, onDelete, selectedTime, selectedDay, isModalOpen, closeModal, existingDescription, isEdit }) => {
    const [description, setDescription] = useState(existingDescription || '');
    const [endTime, setEndTime] = useState('');
    const [selectedColor, setSelectedColor] = useState('#FF5733'); // Default color

    const colorOptions = [
        '#FF5733', '#33FF57', '#3357FF', '#F1C40F',
        '#8E44AD', '#E67E22', '#1ABC9C', '#2C3E50'
    ];

    // Generate time options from 07:00 to 22:00
    const generateTimeOptions = () => {
        const timeOptions = [];
        for (let hour = 7; hour <= 22; hour++) {
            const timeString = hour.toString().padStart(2, '0') + ':00';
            timeOptions.push(timeString);
        }
        return timeOptions;
    };

    const handleSave = async () => {
        if (!description || !selectedTime || !endTime || !selectedDay) {
            toast.error('Please provide all details.');
            return;
        }

        if (endTime <= selectedTime) {
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
            const { data, error } = await supabase
                .from('schedule_blocks')
                .insert([{
                    userid: userId,
                    description,
                    dow: selectedDay,
                    start_time: selectedTime,
                    end_time: endTime,
                    block_color: selectedColor // Store the selected color
                }]);

            if (error) {
                toast.error('Error inserting schedule block: ' + error.message);
                return;
            }

            toast.success('Schedule block added successfully!');
            onSave({ description, startTime: selectedTime, endTime, day: selectedDay, color: selectedColor });

            // Reset the form fields after saving
            setDescription('');
            setEndTime('');
            setSelectedColor('#FF5733'); // Reset to default color
        } catch (error) {
            toast.error('An error occurred: ' + error.message);
        }
    };

    return (
        <Box>
            <ToastContainer />
            <Dialog open={isModalOpen} onClose={closeModal}>
                <DialogTitle>{isEdit ? "Edit or Delete Schedule" : "Add Schedule"}</DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        {/* Description */}
                        <TextField
                            label="Description"
                            fullWidth
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            InputLabelProps={{
                                style: { paddingTop: '0.5rem', fontSize: '1rem' } // Adjust the padding and font size
                            }}
                        />

                        {!isEdit && (
                            <>
                                {/* Day of the Week */}
                                <TextField
                                    label="Day of the Week"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedDay}
                                    onChange={(e) => e.target.value} // Keep this editable if necessary
                                    InputLabelProps={{
                                        style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                    }}
                                />

                                {/* Start Time */}
                                <TextField
                                    label="Start Time"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedTime}
                                    onChange={(e) => e.target.value} // Keep this editable if necessary
                                    InputLabelProps={{
                                        style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                    }}
                                />

                                {/* End Time */}
                                <TextField
                                    label="End Time"
                                    fullWidth
                                    variant="outlined"
                                    select
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    InputLabelProps={{
                                        style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                    }}
                                >
                                    {generateTimeOptions().map(time => (
                                        <MenuItem key={time} value={time}>
                                            {time}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {/* Pick a Color */}
                                <TextField
                                    label="Pick a Color"
                                    fullWidth
                                    variant="outlined"
                                    select
                                    value={selectedColor}
                                    onChange={(e) => setSelectedColor(e.target.value)}
                                    InputLabelProps={{
                                        style: { paddingTop: '0.5rem', fontSize: '1rem' }
                                    }}
                                >
                                    {colorOptions.map(color => (
                                        <MenuItem key={color} value={color}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: color,
                                                display: 'inline-block',
                                                marginRight: '10px',
                                                borderRadius: '4px'
                                            }} />
                                            {color}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {isEdit ? (
                        <>
                            <Button onClick={onDelete} color="secondary" variant="contained">Delete</Button>
                            <Button onClick={handleSave} color="primary" variant="contained">Edit</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={closeModal} color="secondary">Cancel</Button>
                            <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddScheduleButton;
