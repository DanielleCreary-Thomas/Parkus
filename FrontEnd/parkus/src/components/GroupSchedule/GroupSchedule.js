import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase.ts';
import { Box, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './GroupSchedule.css';

const GroupSchedule = () => {
    const { groupId } = useParams(); // Get the groupId from the URL
    const [scheduleBlocks, setScheduleBlocks] = useState([]);
    const [userScheduleBlocks, setUserScheduleBlocks] = useState([]); // For user's own schedule
    const [classColorMap, setClassColorMap] = useState({});
    const [userId, setUserId] = useState(null); // Store user ID

    // Day mappings
    const dayNameToIndex = {
        "Sunday": 0,
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6,
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the user's session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    toast.error('You need to log in to see your schedule.');
                    return; // Return if not logged in
                }

                const currentUserId = session.user.id; // Get the authenticated user's ID
                setUserId(currentUserId); // Store user ID in state

                // Fetch user's schedule
                const { data: userScheduleData, error: userScheduleError } = await supabase
                    .from('schedule_blocks')
                    .select('*')
                    .eq('userid', currentUserId);

                if (userScheduleError) {
                    console.error('Error fetching user schedule:', userScheduleError);
                    toast.error('Failed to fetch your schedule.');
                } else {
                    setUserScheduleBlocks(userScheduleData);
                }

                // Fetch group members (including the current user)
                const { data: usersData, error: usersError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('groupid', groupId);

                if (usersError) {
                    console.error('Error fetching users:', usersError);
                    toast.error('Failed to fetch users.');
                    return;
                }

                const userIds = usersData.map(user => user.userid);

                // Fetch group's schedule based on users in the group
                const { data: groupScheduleData, error: groupScheduleError } = await supabase
                    .from('schedule_blocks')
                    .select('*')
                    .in('userid', userIds);

                if (groupScheduleError) {
                    console.error('Error fetching group schedules:', groupScheduleError);
                    toast.error('Failed to fetch group schedule blocks.');
                } else {
                    setScheduleBlocks(groupScheduleData);
                }

                // Combine both schedules and generate color map
                const allScheduleBlocks = [...groupScheduleData, ...userScheduleData];
                generateClassColorMap(allScheduleBlocks);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('An error occurred while fetching data.');
            }
        };

        fetchData();
    }, [groupId]);

    const calculateBlockStyle = (startTime, endTime) => {
        const getMinutesSinceMidnight = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const startMinutes = getMinutesSinceMidnight(startTime);
        const endMinutes = getMinutesSinceMidnight(endTime);
        const scheduleStartMinutes = 7 * 60; // 7:00 AM
        const heightPerHour = 60; // Should match the .time-slot height in CSS
        const pixelsPerMinute = heightPerHour / 60; // 1 pixel per minute

        const top = (startMinutes - scheduleStartMinutes) * pixelsPerMinute;
        const height = (endMinutes - startMinutes) * pixelsPerMinute;

        return {
            top: `${top}px`,
            height: `${height}px`,
        };
    };

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
            const classKey = block.description;
            if (!colorMap[classKey]) {
                colorMap[classKey] = lightColors[colorIndex % lightColors.length];
                colorIndex++;
            }
        });

        setClassColorMap(colorMap);
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
                            {/* Group schedule blocks (excluding user's own blocks) */}
                            {scheduleBlocks
                                .filter(block => parseInt(block.dow) === dayIdx + 1 && block.userid !== userId)
                                .map(block => {
                                    const style = calculateBlockStyle(block.start_time, block.end_time);
                                    const classKey = block.description;
                                    const blockColor = classColorMap[classKey] || '#FFCCBC'; // Default color

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
                            {/* User's own schedule blocks */}
                            {userScheduleBlocks
                                .filter(block => dayNameToIndex[block.dow] === dayIdx + 1)
                                .map(block => {
                                    const style = calculateBlockStyle(block.start_time, block.end_time);
                                    const classKey = block.description;
                                    const blockColor = classColorMap[classKey] || '#FFCCBC'; // Default color

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
        </Box>
    );
};

export default GroupSchedule;
