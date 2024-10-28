import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import EditUserModal from '../EditUserModal/EditUserModal';

function UserInfo({ user, userData, handleUserInputChange, handleUserSubmit }) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      {user ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'left', width: '100%' }}>
            <Typography><strong>First Name:</strong> {user.first_name}</Typography>
            <Typography><strong>Last Name:</strong> {user.last_name}</Typography>
            <Typography><strong>Student ID:</strong> {user.studentid}</Typography>
            <Typography><strong>Phone Number:</strong> {user.phone_number}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
          </Box>
          <Button variant="contained" onClick={handleOpenModal} sx={{ mt: 2 }}>
            Edit User Info
          </Button>
        </Box>
      ) : (
        <Typography>No user information found. Please update your details below.</Typography>
      )}

      {/* Use EditUserModal component here */}
      <EditUserModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        userData={userData}
        handleUserInputChange={handleUserInputChange}
        handleUserSubmit={() => {
          handleUserSubmit();
          handleCloseModal();
        }}
      />
    </>
  );
}

export default UserInfo;
