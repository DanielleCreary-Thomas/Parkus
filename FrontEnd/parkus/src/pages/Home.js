import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Box,
  Container
} from "@mui/material";
import { supabase } from '../utils/supabase.ts';

function Dashboard() {
    const [groupMembers, setGroupMembers] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

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
                    
                    const { data: groupData, error: groupError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('groupid', userData.groupid);
    
                    if (!groupError && groupData) {
                        setGroupMembers(groupData);
                    }
    
                    const currentDay = new Date().getDay();
                    const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDay];
    
                    const { data: scheduleData, error: scheduleError } = await supabase
                        .from('schedule_blocks')
                        .select('*, users(first_name, last_name)')
                        .eq('dow', dayOfWeek)
                        .in('userid', groupData.map(g => g.userid))
                        .order('start_time');
    
                    if (!scheduleError && scheduleData) {
                        setSchedule(scheduleData.map(item => ({
                            ...item,
                            memberName: item.users.first_name + ' ' + item.users.last_name,
                            isCurrentUser: item.userid === user.id 
                        })));
                    } else {
                        console.error('Error fetching schedule:', scheduleError);
                    }
                }
            }
            setLoading(false);
        };
    
        fetchGroupData();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 5, backgroundColor: '#f5f5f5', minHeight: '80vh' }}>
                <Typography variant="h4" gutterBottom align="center">Welcome, {userData?.first_name + ' ' + userData?.last_name || "User"}</Typography>
                <Box sx={{ mt: 5, mb: 4 }}>
                    <Card raised sx={{ mb: 5 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom align="center">Permit Group</Typography>
                            {groupMembers.map((member, index) => (
                                <Typography key={index} sx={{ my: 3, textAlign: 'center' }}>{member.first_name + ' ' + member.last_name}</Typography>
                            ))}
                        </CardContent>
                    </Card>
                    <Card raised>
                        <CardContent>
                            <Typography variant="h5" gutterBottom align="center">Today's Schedule</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Time</TableCell>
                                            <TableCell>Course</TableCell>
                                            <TableCell>Member</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {schedule.map((item, index) => (
                                            <TableRow key={index} sx={{ backgroundColor: item.isCurrentUser ? '#ffeb3b' : '#e0e0e0' }}>
                                                <TableCell>{`${item.start_time} - ${item.end_time}`}</TableCell>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell>{item.memberName}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Box>
            </Paper>
        </Container>
    );
}

export default Dashboard;
