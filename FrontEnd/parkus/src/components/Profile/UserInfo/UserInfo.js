import React from 'react';
import { Box, Typography } from '@mui/material';

function UserInfo({ user }) {
  return (
    <Box>
      <Typography variant="h5">User Info</Typography>
      <p>First Name: {user.first_name}</p>
      <p>Last Name: {user.last_name}</p>
      <p>Student ID: {user.studentid}</p>
      <p>Phone Number: {user.phone_number}</p>
      <p>Email: {user.email}</p>
    </Box>
  );
}

export default UserInfo;
