import React, { useState, useEffect } from 'react';
import { Box, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, Paper } from "@mui/material";
import AddScheduleButton from '../AddScheduleButton/AddScheduleButton';
import { supabase } from '../../../utils/supabase.ts';
import './TimeTable.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUserScheduleBlocks, checkUserGroupStatus, fetchGroupSize } from '../../../services/requests.js';

const timeSlots = [
    '07:00', '08:00', '09:00', '10:00',
    '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
];

// daysOfWeek is now an object mapping day names to their numeric representation
const daysOfWeek = { 'Monday': '1', 'Tuesday': '2', 'Wednesday': '3', 'Thursday': '4', 'Friday': '5' };

const TimeTable = () => {
    const [schedule, setSchedule] = useState({});
    const [selectedCell, setSelectedCell] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [existingDescription, setExistingDescription] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [currentDay, setCurrentDay] = useState('');
    const [userId, setUserId] = useState(null);
    const [currentScheduleId, setCurrentScheduleId] = useState(null);

    // Function to fetch the schedule data from the database
    const fetchScheduleData = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
    
        if (error || !session) {
            console.error('Error fetching session or user not authenticated:', error);
            return;
        }
    
        setUserId(session.user.id);
    
        // Create an empty schedule object based on timeSlots and daysOfWeek
        const emptySchedule = timeSlots.reduce((acc, time) => {
            acc[time] = Object.keys(daysOfWeek).reduce((week, day) => {
                week[day] = { text: '', isBooked: false };
                return week;
            }, {});
            return acc;
        }, {});
    
        const scheduleBlocks = await fetchUserScheduleBlocks(session.user.id);
    
        // Check if scheduleBlocks is valid and log it
        if (!Array.isArray(scheduleBlocks)) {
            console.error("scheduleBlocks is not an array:", scheduleBlocks);
            return;
        }
    
        // Process the scheduleBlocks array
        scheduleBlocks.forEach((block) => {
            const { scheduleid, description, dow, start_time, end_time, block_color } = block;
            const startHour = parseInt(start_time.split(':')[0], 10);
            const endHour = parseInt(end_time.split(':')[0], 10) - 1; // Adjust endHour to avoid overlapping issues
            const numSlots = (endHour - startHour) + 1; // Calculate the correct rowSpan
    
            const dayString = Object.keys(daysOfWeek).find(key => daysOfWeek[key] === dow);
    
            for (let hour = startHour; hour <= endHour; hour++) {
                const timeString = hour.toString().padStart(2, '0') + ':00';
                if (hour === startHour) {
                    emptySchedule[timeString][dayString] = {
                        text: description,
                        isBooked: true,
                        rowSpan: numSlots,
                        color: block_color,
                        scheduleid,
                        startTime: formatTime(start_time),
                        endTime: formatTime(end_time)
                    };
                } else {
                    emptySchedule[timeString][dayString] = {
                        text: '',
                        isBooked: true,
                        hidden: true,
                        color: block_color
                    };
                }
            }
        });
    
        setSchedule(emptySchedule);
    };
    

    // Fetch schedule data on component mount
    useEffect(() => {
        fetchScheduleData();
    }, []);

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const handleCellClick = async (time, day) => {
        const slot = schedule[time][day];
        setCurrentTime(time);
        setCurrentDay(day);
    
        try {
            // Call the function that checks the user's group status
            const groupCheckResult = await checkUserGroupStatus(userId);
            console.log('Group Check Result:', groupCheckResult); // Debugging log
    
            // Check if the user is part of a group
            if (groupCheckResult && groupCheckResult.groupid) {
                console.log('User is in a group, checking group size...');
    
                const groupSizeData = await fetchGroupSize(groupCheckResult.groupid);
                console.log('Group Size Data:', groupSizeData); // Debugging log
    
                // Prevent editing if the group size is more than 1
                if (groupSizeData.group_size > 1) {
                    toast.error('Cannot change schedule. You already joined a group or paid.');
                    return;
                }
            } else {
                // If the user is not in a group, allow them to edit the schedule
                console.log('User is not in a group, allowing schedule edit.');
            }
    
            // Proceed with editing or adding the schedule block
            if (!slot.isBooked) {
                setSelectedCell({ time, day });
                setIsEdit(false);
                setExistingDescription('');
                setCurrentScheduleId(null);
            } else {
                setSelectedCell({ time, day });
                setIsEdit(true);
                setExistingDescription(slot.text);
                setCurrentScheduleId(slot.scheduleid);
            }
    
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error checking group status:', error);
            toast.error('Error checking group status.');
        }
    };
    
    

    const handleSaveTimeBlock = (newTimeBlock) => {
        const { day, startTime, endTime, description, color } = newTimeBlock;
        const startHour = parseInt(startTime.split(':')[0], 10);
        const endHour = parseInt(endTime.split(':')[0], 10) - 1; // Adjust endHour
        const numSlots = (endHour - startHour) + 1; // Calculate correct rowSpan

        setSchedule(prevSchedule => {
            const newSchedule = { ...prevSchedule };

            for (let hour = startHour; hour <= endHour; hour++) {
                const timeString = hour.toString().padStart(2, '0') + ':00';

                if (hour === startHour) {
                    newSchedule[timeString] = {
                        ...newSchedule[timeString],
                        [day]: { text: description, isBooked: true, rowSpan: numSlots, color, startTime: formatTime(startTime), endTime: formatTime(endTime) }
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
        fetchScheduleData(); // Refresh the schedule after save
    };

    const handleDeleteTimeBlock = () => {
        const { time, day } = selectedCell;
        setSchedule(prev => {
            const newSchedule = { ...prev };
            const startHour = parseInt(time.split(':')[0], 10);
            const rowSpan = schedule[time][day].rowSpan || 1;

            for (let hour = startHour; hour < startHour + rowSpan; hour++) {
                const timeString = hour.toString().padStart(2, '0') + ':00';
                newSchedule[timeString] = {
                    ...newSchedule[timeString],
                    [day]: { text: '', isBooked: false, hidden: false }
                };
            }

            return newSchedule;
        });

        setIsModalOpen(false);
        fetchScheduleData(); // Refresh the schedule after delete
    };

    const getTimeSlotRow = (time, day) => {
        const slot = schedule[time] ? schedule[time][day] : { text: '', isBooked: false };

        if (slot.hidden) {
            return null;
        }

        const cellColor = slot.color || 'transparent';

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
                <br />
                {slot.startTime && slot.endTime && (
                    <span style={{ fontSize: '0.8em' }}>
                        {slot.startTime} - {slot.endTime}
                    </span>
                )}
            </TableCell>
        );
    };

    return ( 
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
            <ToastContainer />
            <TableContainer
                component={Paper}
                sx={{ width:'95%' ,maxWidth: '75rem', borderRadius: '30px', overflow: 'hidden' }} // Apply borderRadius and overflow
            >
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="header-cell" sx={{ borderTopLeftRadius: '30px' }}>Time</TableCell> {/* Add border radius for first header cell */}
                            {Object.keys(daysOfWeek).map((day, index, arr) => (
                                <TableCell
                                    key={daysOfWeek[day]}
                                    align="center"
                                    className="header-cell"
                                    sx={{
                                        ...(index === arr.length - 1 && { borderTopRightRadius: '30px' }) // Add border radius for last header cell
                                    }}
                                >
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
                                {Object.keys(daysOfWeek).map(day => getTimeSlotRow(time, day))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    
            {selectedCell && (
                <AddScheduleButton
                    onSave={handleSaveTimeBlock}
                    onDelete={handleDeleteTimeBlock}
                    selectedTime={currentTime}
                    selectedDay={currentDay}
                    existingDescription={existingDescription}
                    isModalOpen={isModalOpen}
                    closeModal={() => setIsModalOpen(false)}
                    isEdit={isEdit}
                    scheduleid={currentScheduleId}
                    refreshSchedule={fetchScheduleData} //refresh after time block changes
                />
            )}
        </Box>
    );
    
};

export default TimeTable;
