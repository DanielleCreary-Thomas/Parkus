import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase.ts';
import { Box, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import JoinButton from './JoinButton/JoinButton';
import './GroupSchedule.css';

const GroupSchedule = () => {
    const { groupId } = useParams();
    const [scheduleBlocks, setScheduleBlocks] = useState([]);
    const [userScheduleBlocks, setUserScheduleBlocks] = useState([]);
    const [classColorMap, setClassColorMap] = useState({});
    const [userId, setUserId] = useState(null);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get current user from Supabase
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError || !session) {
                    toast.error('You need to log in to see your schedule.');
                    return;
                }

                const currentUserId = session.user.id;
                setUserId(currentUserId);

                const scheduleResponse = await fetch('http://127.0.0.1:5000/group-schedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        group_id: groupId,
                        user_id: currentUserId
                    })
                });

                if (!scheduleResponse.ok) {
                    const errorData = await scheduleResponse.json();
                    toast.error(errorData.error || 'Failed to fetch data.');
                    return;
                }

                const data = await scheduleResponse.json();

                setScheduleBlocks(data.group_schedule);
                setUserScheduleBlocks(data.user_schedule);

                const allScheduleBlocks = [...data.group_schedule, ...data.user_schedule];
                generateClassColorMap(allScheduleBlocks);

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('An error occurred while fetching data.');
            }
        };

        fetchData();
    }, [groupId]);

    const lightColors = [
        '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9',
        '#C5CAE9', '#BBDEFB', '#B3E5FC', '#B2EBF2',
        '#B2DFDB', '#C8E6C9', '#DCEDC8', '#F0F4C3',
        '#FFF9C4', '#FFECB3', '#FFE0B2', '#FFCCBC',
        '#D7CCC8', '#CFD8DC',
    ];

    const generateClassColorMap = (blocks) => {
        const colorMap = {};
        let colorIndex = 0;

        blocks.forEach(block => {
            const classKey = block.description || block.scheduleid;
            if (!colorMap[classKey]) {
                colorMap[classKey] = lightColors[colorIndex % lightColors.length];
                colorIndex++;
            }
        });

        setClassColorMap(colorMap);
    };

    const calculateBlockStyle = (startTime, endTime) => {
        const getMinutesSinceMidnight = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const startMinutes = getMinutesSinceMidnight(startTime);
        const endMinutes = getMinutesSinceMidnight(endTime);
        const scheduleStartMinutes = 7 * 60;
        const heightPerHour = 60;
        const pixelsPerMinute = heightPerHour / 60;

        const top = (startMinutes - scheduleStartMinutes) * pixelsPerMinute;
        const height = (endMinutes - startMinutes) * pixelsPerMinute;

        return {
            top: `${top}px`,
            height: `${height}px`,
        };
    };

    return (
        <Box sx={{ padding: 3 }}>
            <ToastContainer />
            <Typography variant="h4" align="center" gutterBottom>
                Schedule for Group ID: {groupId}
            </Typography>
            <div className="schedule-grid">
                <div className="time-column">
                    <div className="time-header">Time</div>
                    {Array.from({ length: 16 }, (_, i) => `${7 + i}:00`).map((time, index) => (
                        <div key={index} className="time-slot">
                            {time}
                        </div>
                    ))}
                </div>

                {daysOfWeek.map((dayName, dayIdx) => (
                    <div key={dayIdx} className="day-column">
                        <div className="day-header">{dayName}</div>
                        <div className="day-content">
                            {scheduleBlocks
                                .filter(block => parseInt(block.dow) === dayIdx + 1 && block.userid !== userId)
                                .map(block => {
                                    const style = calculateBlockStyle(block.start_time, block.end_time);
                                    const classKey = block.description || block.scheduleid;
                                    const blockColor = classColorMap[classKey] || '#FFCCBC';

                                    return (
                                        <div
                                            key={`${block.scheduleid}-${block.userid}`}
                                            className="schedule-block"
                                            style={{
                                                ...style,
                                                backgroundColor: blockColor,
                                            }}
                                        >
                                            <span className="block-title">{block.description}</span>
                                            <br />
                                            <span className="block-time">
                                                {block.start_time} - {block.end_time}
                                            </span>
                                        </div>
                                    );
                                })}
                            {userScheduleBlocks
                                .filter(block => parseInt(block.dow) === dayIdx + 1)
                                .map(block => {
                                    const style = calculateBlockStyle(block.start_time, block.end_time);
                                    const classKey = block.description || block.scheduleid;
                                    const blockColor = classColorMap[classKey] || '#FFCCBC';

                                    return (
                                        <div
                                            key={`${block.scheduleid}-${block.userid}`}
                                            className="schedule-block user-schedule-block"
                                            style={{
                                                ...style,
                                                backgroundColor: blockColor,
                                            }}
                                        >
                                            <span className="block-title">{block.description} (You)</span>
                                            <br />
                                            <span className="block-time">
                                                {block.start_time} - {block.end_time}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
            return (
            <Box sx={{ padding: 3 }}>
                <ToastContainer />
                <Typography variant="h4" align="center" gutterBottom>
                    Schedule for Group ID: {groupId}
                </Typography>
                <div className="schedule-grid">
                    {/* ... existing schedule grid code */}
                </div>
                {/* Add the JoinButton here */}
                <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                    <JoinButton groupId={groupId} />
                </Box>
            </Box>
            );

        </Box>
    );
};

export default GroupSchedule;
