// SavedTimeBlocks.jsx
import React, { useState, useEffect } from 'react';
import { Box, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, Paper } from "@mui/material";
import {useParams} from "react-router-dom";

const timeSlots = [
    '07:00', '08:00', '09:00', '10:00',
    '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const SavedTimeBlocks = () => {
    const [schedule, setSchedule] = useState({});
    const { userId } = useParams();  // This will get the userId from the URL

    useEffect(() => {
        const url = `http://localhost:5000/api/users/${userId}/schedule`;

        fetch(url)
            .then(response => response.json())
            .then(fetchedData => {
                console.log('Fetched data:', fetchedData); // Log fetched data
                if (fetchedData && Object.keys(fetchedData).length > 0) {
                    const initSchedule = timeSlots.reduce((acc, time) => {
                        acc[time] = daysOfWeek.reduce((week, day) => {
                            week[day] = { text: '', isBooked: false };
                            return week;
                        }, {});
                        return acc;
                    }, {});

                    Object.entries(fetchedData).forEach(([time, daySchedules]) => {
                        Object.entries(daySchedules).forEach(([dayIndex, scheduleDetails]) => {
                            const startIdx = timeSlots.indexOf(time);
                            const dayName = daysOfWeek[parseInt(dayIndex) - 1];
                            if (dayName && startIdx !== -1) {
                                initSchedule[time][dayName] = {
                                    text: scheduleDetails.text,
                                    isBooked: true,
                                    rowSpan: scheduleDetails.rowspan
                                };

                                for (let i = startIdx + 1; i < startIdx + scheduleDetails.rowspan; i++) {
                                    if (timeSlots[i]) {
                                        initSchedule[timeSlots[i]][dayName] = { isBooked: true };
                                    }
                                }
                            }
                        });
                    });

                    setSchedule(initSchedule);
                } else {
                    console.log('No data returned or error fetching schedule');
                }
            })
            .catch(error => {
                console.error('Error fetching schedule:', error);
            });
    }, [userId]);

    const getTimeSlotRow = (time, day) => {
        const slot = schedule[time] ? schedule[time][day] : { text: '', isBooked: false };

        if (!slot.isBooked || (slot.isBooked && !slot.text)) {
            return null;
        }

        return (
            <TableCell
                key={day}
                align="center"
                sx={{ backgroundColor: '#c8e6c9' }}
                rowSpan={slot.rowSpan || 1}
            >
                {slot.text}
            </TableCell>
        );
    };

    return (
        <Box sx={{ maxWidth: '100vw', display: 'flex', justifyContent: 'center' }}>
            <TableContainer component={Paper} sx={{ maxWidth: '65vw', margin: 'auto' }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            {daysOfWeek.map(day => (
                                <TableCell key={day} align="center">{day}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timeSlots.map(time => (
                            <TableRow key={time}>
                                <TableCell component="th" scope="row">{time}</TableCell>
                                {daysOfWeek.map(day => getTimeSlotRow(time, day))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SavedTimeBlocks;
