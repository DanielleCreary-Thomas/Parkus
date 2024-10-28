import React from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';

const EditUserModal = ({ 
    openModal, 
    handleCloseModal, 
    userData, 
    handleUserInputChange, 
    handleUserSubmit 
  }) => {
    return (
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '60%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h6" gutterBottom>Edit User Information</Typography>
          
          {/* Use userData here */}
          <TextField 
            label="First Name" 
            name="first_name" 
            value={userData.first_name || ''} 
            onChange={handleUserInputChange} 
            fullWidth 
            margin="normal" 
            InputLabelProps={{ shrink: true }} 
          />
          <TextField 
            label="Last Name" 
            name="last_name" 
            value={userData.last_name || ''} 
            onChange={handleUserInputChange} 
            fullWidth 
            margin="normal" 
            InputLabelProps={{ shrink: true }} 
          />
          <TextField 
            label="Student ID" 
            name="studentid" 
            value={userData.studentid || ''} 
            onChange={handleUserInputChange} 
            fullWidth 
            margin="normal" 
            InputLabelProps={{ shrink: true }} 
          />
          <TextField 
            label="Phone Number" 
            name="phone_number" 
            value={userData.phone_number || ''} 
            onChange={handleUserInputChange} 
            fullWidth 
            margin="normal" 
            InputLabelProps={{ shrink: true }} 
          />
          <TextField 
            label="Email" 
            name="email" 
            value={userData.email || ''} 
            onChange={handleUserInputChange} 
            fullWidth 
            margin="normal" 
            InputLabelProps={{ shrink: true }} 
          />
  
          <Button 
            variant="contained" 
            onClick={() => {
              handleUserSubmit();
              handleCloseModal();
            }} 
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    );
  };
  

export default EditUserModal;
