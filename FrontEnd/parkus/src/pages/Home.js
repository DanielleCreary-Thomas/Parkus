import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Paper,
  Box,
  Container,
  Grid
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

                if (userError || !userData) {
                    console.error('Error fetching user details:', userError);
                    setLoading(false);
                    return;
                } else {
                    setUserData(userData);

                    const { data: groupData, error: groupError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('groupid', userData.groupid);

                    if (groupError || !groupData) {
                        console.error('Error fetching group data:', groupError);
                        setLoading(false);
                        return;
                    }

                    setGroupMembers(groupData);

                    const currentDate = moment().format("YYYY-MM-DD");

                    const { data: scheduleData, error: scheduleError } = await supabase
                        .from('schedule_blocks')
                        .select('*, users(first_name, last_name)')
                        .in('userid', groupData.map(g => g.userid))
                        .order('start_time');

                    if (scheduleError || !scheduleData) {
                        console.error('Error fetching schedule:', scheduleError);
                        setLoading(false);
                        return;
                    }

                    // Filter schedule to only show events for the current day
                    const filteredSchedule = scheduleData.filter(item =>
                        moment(item.start_time).isSame(currentDate, 'day')
                    );

                    setSchedule(filteredSchedule.map(item => ({
                        ...item,
                        memberName: item.users.first_name + ' ' + item.users.last_name,
                        start: new Date(item.start_time),  // Convert start_time to Date object
                        end: new Date(item.end_time),      // Convert end_time to Date object
                        title: `${item.description} - ${item.users.first_name} ${item.users.last_name}`
                    })));
                }
            }
            setLoading(false);
            setNotificationCount(2);
        };

        fetchGroupData();
    }, []);

    // Inline custom toolbar component to hide navigation buttons
    const CustomToolbar = () => {
        return <div></div>;  // Empty toolbar
    };

    if (loading) return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, width: '90%' }}>  {/* Adjust maxWidth and width */}
            <Paper elevation={3} sx={{ p: 5, backgroundColor: '#f5f5f5', minHeight: '80vh' }} className="loading">
                <Typography variant="h5">Loading...</Typography>
            </Paper>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, width: '75%' }}>  {/* Adjust maxWidth and width */}
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
                        {/* Permit Group Section (Left Side) */}
                        <Grid item xs={12} md={6}>
                            <Card raised sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h5" gutterBottom align="center" className="subheading">
                                        Permit Group
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                                        {groupMembers.map((member, index) => (
                                            <Typography key={index} sx={{ my: 1 }}>
                                                {member.first_name + ' ' + member.last_name}
                                            </Typography>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Calendar Section (Right Side) */}
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
                                            components={{
                                                toolbar: CustomToolbar  // Use custom inline toolbar to hide navigation buttons
                                            }}
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
