import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Box,
  Container
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { supabase } from '../utils/supabase.ts';
import './styles/home.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function Dashboard() {
    const [groupMembers, setGroupMembers] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        const fetchGroupData = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Error fetching authenticated user:', error);
                setLoading(false);
                return;
            }

            if (user) {
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('userid', user.id)
                    .single();

                if (userError) {
                    console.error('Error fetching user details:', userError);
                } else {
                    setUserData(userData);

                    // Fetch group members based on the user's groupid
                    const { data: groupData, error: groupError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('groupid', userData.groupid);

                    if (!groupError && groupData) {
                        setGroupMembers(groupData);

                        // Log group data and group member IDs
                        console.log("Group Data:", groupData);

                        const groupUserIds = groupData.map(g => g.userid);

                        // Log groupUserIds to ensure all member IDs are present
                        console.log("Group User IDs:", groupUserIds);

                        const currentDay = new Date().getDay();
                        const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDay];

                        const { data: scheduleData, error: scheduleError } = await supabase
                            .from('schedule_blocks')
                            .select('*, users(first_name, last_name)')
                            .eq('dow', dayOfWeek)
                            .in('userid', groupUserIds) // Fetch schedules for all group members
                            .order('start_time');

                        if (!scheduleError && scheduleData) {
                            console.log("Fetched Schedule Data:", scheduleData);

                            // Get today's date
                            const today = new Date();

                            // Combine `start_time` and `end_time` with the current date
                            const formattedSchedule = scheduleData.map(item => {
                                const [startHour, startMinute] = item.start_time.split(':');
                                const [endHour, endMinute] = item.end_time.split(':');

                                // Create Date objects for start and end times on today's date
                                const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
                                const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);

                                return {
                                    title: `${item.description} - ${item.users.first_name} ${item.users.last_name}`,
                                    start: startDate,
                                    end: endDate,
                                    blockColor: item.block_color  // Add block color for each event
                                };
                            });

                            setSchedule(formattedSchedule);
                        } else {
                            console.error('Error fetching schedule:', scheduleError);
                        }
                    }
                }
            }
            setLoading(false);
            setNotificationCount(2); 
        };

        fetchGroupData();
    }, []);

    // Function to set event style based on blockColor
    const eventPropGetter = (event) => {
        const backgroundColor = event.blockColor || '#3174ad'; 
        return {
            style: { backgroundColor }
        };
    };

    if (loading) return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 5, backgroundColor: '#f5f5f5', minHeight: '80vh' }} className="loading">
                <Typography variant="h5">Loading...</Typography>
            </Paper>
        </Container>
    );

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 5, backgroundColor: '#f5f5f5', minHeight: '80vh' }}>
                <Typography variant="h4" gutterBottom align="center" className="heading">
                    Welcome, {userData?.first_name + ' ' + userData?.last_name || "User"}
                    <IconButton aria-label="notifications" color="default" className="notification">
                        <Badge badgeContent={notificationCount} color="primary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Typography>

                <Box sx={{ mt: 5, mb: 4 }}>
                    <Grid container spacing={2}>
                        {/* Permit Group Section */}
                        <Grid item xs={12} md={6}>
                            <Card raised sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" gutterBottom align="center" className="subheading">
                                        Permit Group
                                    </Typography>
                                    {groupMembers.map((member, index) => (
                                        <Typography key={index} sx={{ my: 3, textAlign: 'center' }}>
                                            {member.first_name + ' ' + member.last_name}
                                        </Typography>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Calendar Section */}
                        <Grid item xs={12} md={6}>
                            <Card raised sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" gutterBottom align="center" className="subheading">
                                        Today's Schedule
                                    </Typography>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Calendar
                                            localizer={localizer}
                                            events={schedule}
                                            startAccessor="start"
                                            endAccessor="end"
                                            views={['day']}  // Only show day view
                                            defaultView="day"  // Set the default view to day
                                            style={{ height: '100%' }}  // Make calendar fill height
                                            min={new Date(2023, 9, 27, 8, 0)}  // Start time at 8:00 AM
                                            max={new Date(2023, 9, 27, 22, 0)}  // End time at 10:00 PM
                                            step={30}  // 30-minute intervals
                                            timeslots={2}  // Show 2 timeslots per hour
                                            defaultDate={new Date()}  // Ensure calendar starts on current day
                                            eventPropGetter={eventPropGetter} // Apply block color to each event
                                            toolbar={false}  // Disable the toolbar (removes Today, Back, Next)
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default Dashboard;
