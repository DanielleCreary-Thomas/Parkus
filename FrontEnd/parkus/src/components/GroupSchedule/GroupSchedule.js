// src/components/GroupSchedule/GroupSchedule.js

import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase.ts';
import Box from '@mui/material/Box';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import JoinButton from './JoinButton/JoinButton';
import BackButton from './BackButton/BackButton';
import './GroupSchedule.css';

const GroupSchedule = () => {
    const { groupId } = useParams();
    const [scheduleBlocks, setScheduleBlocks] = useState([]);
    const [userScheduleBlocks, setUserScheduleBlocks] = useState([]);
    const [classColorMap, setClassColorMap] = useState({});
    const [userId, setUserId] = useState(null);
    const [users, setUsers] = useState([]);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession();
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
                        user_id: currentUserId,
                    }),
                });

                if (!scheduleResponse.ok) {
                    const errorData = await scheduleResponse.json();
                    toast.error(errorData.error || 'Failed to fetch data.');
                    return;
                }

                const data = await scheduleResponse.json();

                if (!data.users.some((user) => user.userid === currentUserId)) {
                    const { data: currentUserData, error: currentUserError } = await supabase
                        .from('users')
                        .select('userid, first_name, last_name')
                        .eq('userid', currentUserId)
                        .single();
                    if (currentUserError) {
                        console.error('Error fetching current user:', currentUserError);
                    } else {
                        data.users.push(currentUserData);
                    }
                }

                setUsers(data.users);
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
        '#C5B6DD', '#A9B7C4', '#A2BBF3', '#8CD3D0',
        '#AEF1C8', '#E4DEA7', '#E9C8A8', '#D7B0AE'
    ];

    const generateClassColorMap = (blocks) => {
        const colorMap = {};
        let colorIndex = 0;

        const uniqueUserIds = [...new Set(blocks.map((block) => block.userid))];

        uniqueUserIds.forEach((userId) => {
            if (!colorMap[userId]) {
                colorMap[userId] = lightColors[colorIndex % lightColors.length];
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
        const scheduleStartMinutes = 7 * 60; // 7:00 AM
        const scheduleEndMinutes = 23 * 60;  // 11:00 PM

        const totalScheduleMinutes = scheduleEndMinutes - scheduleStartMinutes;
        const scheduleHeight = 960; // Height of .day-content in CSS

        const pixelsPerMinute = scheduleHeight / totalScheduleMinutes;

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

            {/* Header Container */}
            <div className="header-container">
                {/* Back Button at the top left */}
                <div className="back-button-container">
                    <BackButton />
                </div>

                {/* Title */}
                <Box
                    className="scheduleTitle"
                    bgcolor="#FFFFFF"
                    sx={{
                        width: "90%",
                        maxWidth: "75rem",
                        border: "3px solid black",
                        borderRadius: 7,
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        margin: "2rem auto",
                    }}
                >
                    <h1 style={{ fontFamily: "Orelega One", fontSize: "2rem" }}>SpotSharing Generation</h1>
                </Box>
            </div>

            {/* Group Members Container with Join Button on the right */}
            <div className="group-members-box">
                <h2 className="group-members-title">Group Members</h2>
                <div className="group-members-container">
                    {/* Group Members List */}
                    <div className="group-members-list">
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <div
                                    key={user.userid}
                                    className="group-member-card"
                                    style={{
                                        backgroundColor: classColorMap[user.userid] || '#FFCCBC',
                                    }}
                                >
                                    {user.first_name} {user.last_name}
                                    {user.userid === userId ? ' (you)' : ''}
                                </div>
                            ))
                        ) : (
                            <p>No group members found.</p>
                        )}
                    </div>
                    {/* Join Button on the right */}
                    <div className="join-button-container">
                        <JoinButton groupId={groupId} />
                    </div>
                </div>
            </div>

            {/* Schedule Grid */}
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
                                .filter((block) => parseInt(block.dow) === dayIdx + 1 && block.userid !== userId)
                                .map((block) => {
                                    const style = calculateBlockStyle(block.start_time, block.end_time);
                                    const blockColor = classColorMap[block.userid] || '#FFCCBC';

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
                                .filter((block) => parseInt(block.dow) === dayIdx + 1)
                                .map((block) => {
                                    const style = calculateBlockStyle(block.start_time, block.end_time);
                                    const blockColor = classColorMap[block.userid] || '#A5D6A7';

                                    return (
                                        <div
                                            key={`${block.scheduleid}-${block.userid}`}
                                            className="schedule-block user-schedule-block"
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
                        </div>
                    </div>
                ))}
            </div>
        </Box>
    );
};

export default GroupSchedule;
