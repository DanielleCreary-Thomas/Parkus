import React, { useState, useEffect } from 'react';
import { Box, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, Paper } from "@mui/material";
import AddScheduleButton from '../AddScheduleButton/AddScheduleButton';
import { supabase } from '../../../utils/supabase.ts';
import './TimeTable.css';

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
            // Convert daysOfWeek object keys to an array
            acc[time] = Object.keys(daysOfWeek).reduce((week, day) => {
                week[day] = { text: '', isBooked: false };
                return week;
            }, {});
            return acc;
        }, {});

        const { data: scheduleBlocks, error: scheduleError } = await supabase
            .from('schedule_blocks')
            .select('*')
            .eq('userid', session.user.id);

        if (scheduleError) {
            console.error("Error fetching schedule data:", scheduleError);
            return;
        }

        scheduleBlocks.forEach((block) => {
            const { scheduleid, description, dow, start_time, end_time, block_color } = block;
            const startHour = parseInt(start_time.split(':')[0], 10);
            const endHour = parseInt(end_time.split(':')[0], 10) - 1; // Adjust endHour to avoid overlapping issues
            const numSlots = (endHour - startHour) + 1; // Calculate the correct rowSpan

            // Convert numeric dow back to day string
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

    const handleCellClick = (time, day) => {
        const slot = schedule[time][day];
        setCurrentTime(time);
        setCurrentDay(day);

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
            <TableContainer component={Paper} sx={{ maxWidth: '75rem' }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="header-cell">Time</TableCell>
                            {Object.keys(daysOfWeek).map(day => (
                                <TableCell key={daysOfWeek[day]} align="center" className="header-cell">
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
