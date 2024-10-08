// components/EditPermitModal.js
import React from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';

const EditPermitModal = ({ openModal, handleCloseModal, permitData, handlePermitInputChange, handlePermitUpdate }) => {
  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography variant="h6" gutterBottom>Edit Permit Information</Typography>
        <TextField label="Permit Number" name="permit_number" value={permitData?.permit_number || ''} onChange={handlePermitInputChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField select label="Permit Type" name="permit_type" value={permitData?.permit_type || ''} onChange={handlePermitInputChange} fullWidth margin="normal" SelectProps={{ native: true }} InputLabelProps={{ shrink: true }}>
          <option value="Virtual">Virtual</option>
          <option value="Physical">Physical</option>
        </TextField>
        <TextField label="Activation Date" type="date" name="activate_date" value={permitData?.activate_date || ''} onChange={handlePermitInputChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="Expiration Date" type="date" name="expiration_date" value={permitData?.expiration_date || ''} onChange={handlePermitInputChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField select label="Campus Location" name="campus_location" value={permitData?.campus_location || ''} onChange={handlePermitInputChange} fullWidth margin="normal" SelectProps={{ native: true }} InputLabelProps={{ shrink: true }}>
          <option value="Trafalgar Campus">Trafalgar Campus</option>
          <option value="Davis Campus">Davis Campus</option>
        </TextField>
        <TextField select label="Active Status" name="active_status" value={permitData?.active_status || ''} onChange={handlePermitInputChange} fullWidth margin="normal" SelectProps={{ native: true }} InputLabelProps={{ shrink: true }}>
          <option value="TRUE">Active</option>
          <option value="FALSE">Inactive</option>
        </TextField>
        <Button variant="contained" onClick={handlePermitUpdate} sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default EditPermitModal;
