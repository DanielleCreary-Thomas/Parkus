import React, { useState, useEffect } from 'react';
import { Box, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, Paper } from "@mui/material";
import './TimeTable.css';
import AddScheduleButton from '../AddScheduleButton/AddScheduleButton';
import { supabase } from '../../../utils/supabase.ts';

const timeSlots = [
    '07:00', '08:00', '09:00', '10:00',
    '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TimeTable = () => {
    const [schedule, setSchedule] = useState({});
    const [selectedCell, setSelectedCell] = useState(null); // Track selected cell
    const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
    const [isEdit, setIsEdit] = useState(false); // Track whether editing or adding a new schedule
    const [existingDescription, setExistingDescription] = useState(''); // Prepopulate description if editing
    const [currentTime, setCurrentTime] = useState(''); // Track start time
    const [currentDay, setCurrentDay] = useState(''); // Track current day
    const [userId, setUserId] = useState(null); // Track the current user ID

    // Fetch and initialize schedule for the current user
    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error || !session) {
                console.error('Error fetching session or user not authenticated:', error);
                return;
            }

            setUserId(session.user.id);  // Store the user's ID in state

            // Initialize an empty schedule
            const emptySchedule = timeSlots.reduce((acc, time) => {
                acc[time] = daysOfWeek.reduce((week, day) => {
                    week[day] = { text: '', isBooked: false };
                    return week;
                }, {});
                return acc;
            }, {});

            // Fetch schedule blocks for the current user
            const { data: scheduleBlocks, error: scheduleError } = await supabase
                .from('schedule_blocks')
                .select('*')
                .eq('userid', session.user.id); // Fetch only the current user's data
            
            if (scheduleError) {
                console.error("Error fetching schedule data:", scheduleError);
                return;
            }

            // Map the fetched data into the schedule
            scheduleBlocks.forEach((block) => {
                const { description, dow, start_time, end_time, block_color } = block; // Use block_color from the database
                const startHour = parseInt(start_time.split(':')[0], 10);
                const endHour = parseInt(end_time.split(':')[0], 10);
                const numSlots = (endHour - startHour) + 1; // Ensure end time is included

                for (let hour = startHour; hour < endHour + 1; hour++) {
                    const timeString = hour.toString().padStart(2, '0') + ':00';
                    if (hour === startHour) {
                        emptySchedule[timeString][dow] = {
                            text: description,
                            isBooked: true,
                            rowSpan: numSlots,
                            color: block_color // Store the color from the database
                        };
                    } else {
                        emptySchedule[timeString][dow] = {
                            text: '',
                            isBooked: true,
                            hidden: true,
                            color: block_color // Ensure hidden slots also have the color
                        };
                    }
                }
            });

            setSchedule(emptySchedule);
        };

        fetchUserData();
    }, []);

    // Handle cell click
    const handleCellClick = (time, day) => {
        const slot = schedule[time][day];

        // Set selected time and day every time you click a cell
        setCurrentTime(time);
        setCurrentDay(day);

        if (!slot.isBooked) {
            // If the slot is not booked, we are adding a new schedule
            setSelectedCell({ time, day });
            setIsEdit(false); // Set to add mode
            setExistingDescription(''); // Reset description
        } else {
            // If the slot is booked, we can edit or delete
            setSelectedCell({ time, day });
            setIsEdit(true); // Set to edit mode
            setExistingDescription(slot.text); // Prepopulate with existing description
        }

        // Open modal after setting state
        setIsModalOpen(true);
    };

    const handleSaveTimeBlock = (newTimeBlock) => {
        const { day, startTime, endTime, description, color } = newTimeBlock;
    
        const startHour = parseInt(startTime.split(':')[0], 10);
        const endHour = parseInt(endTime.split(':')[0], 10);
        const numSlots = (endHour - startHour) + 1;
    
        setSchedule(prevSchedule => {
            const newSchedule = { ...prevSchedule };
    
            for (let hour = startHour; hour < endHour + 1; hour++) {
                const timeString = hour.toString().padStart(2, '0') + ':00';
    
                if (hour === startHour) {
                    newSchedule[timeString] = {
                        ...newSchedule[timeString],
                        [day]: { text: description, isBooked: true, rowSpan: numSlots, color }
                    };
                } else {
                    newSchedule[timeString] = {
                        ...newSchedule[timeString],
                        [day]: { text: '', isBooked: true, hidden: true }
                    };
                }
            }
    
            return newSchedule;
        });
    
        setIsModalOpen(false);
    };

    // Handle delete action
    const handleDeleteTimeBlock = () => {
        const { time, day } = selectedCell;

        setSchedule(prev => {
            const newSchedule = { ...prev };

            // Find the number of slots to delete
            const startHour = parseInt(time.split(':')[0], 10);
            const rowSpan = schedule[time][day].rowSpan || 1;

            // Clear all relevant time slots
            for (let hour = startHour; hour < startHour + rowSpan; hour++) {
                const timeString = hour.toString().padStart(2, '0') + ':00';
                newSchedule[timeString] = {
                    ...newSchedule[timeString],
                    [day]: { text: '', isBooked: false, hidden: false } // Reset the cells
                };
            }

            return newSchedule;
        });

        // Close modal after deleting
        setIsModalOpen(false);
    };

    // Render each time slot row
    const getTimeSlotRow = (time, day) => {
        const slot = schedule[time] ? schedule[time][day] : { text: '', isBooked: false };
    
        if (slot.hidden) {
            return null;
        }
    
        const cellColor = slot.color || 'transparent'; // Use the color from the slot
    
        return (
            <TableCell
                key={day}
                align="center"
                className="time-block"
                onClick={() => handleCellClick(time, day)}
                rowSpan={slot.rowSpan || 1}
                style={{
                    backgroundColor: cellColor,
                    position: 'relative',
                    cursor: 'pointer'
                }}
            >
                {slot.text}
            </TableCell>
        );
    };
    
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
            <TableContainer component={Paper} sx={{ maxWidth: '75rem' }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="header-cell">Time</TableCell>
                            {daysOfWeek.map(day => (
                                <TableCell key={day} align="center" className="header-cell">
                                    {day}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timeSlots.map(time => (
                            <TableRow key={time}>
                                <TableCell component="th" scope="row" className="time-cell">
                                    {time}
                                </TableCell>
                                {daysOfWeek.map(day => getTimeSlotRow(time, day))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* AddScheduleButton component */}
            {selectedCell && (
                <AddScheduleButton
                    onSave={handleSaveTimeBlock}
                    onDelete={handleDeleteTimeBlock}
                    selectedTime={currentTime}  // Ensure updated time is passed
                    selectedDay={currentDay}    // Ensure updated day is passed
                    existingDescription={existingDescription}
                    isModalOpen={isModalOpen}
                    closeModal={() => setIsModalOpen(false)}
                    isEdit={isEdit}
                />
            )}
        </Box>
    );
};

export default TimeTable;

