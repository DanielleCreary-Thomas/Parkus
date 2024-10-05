import React from 'react';
import { Box, TextField, Button, Checkbox, Typography } from '@mui/material';

function PermitInfo({ permitData, permitInputEnabled, handlePermitInputChange, handleCheckboxChange, handlePermitSubmit }) {
  return (
    <div>
      <Typography variant="h5">Parking Permit Info</Typography>
      <Checkbox checked={permitInputEnabled} onChange={handleCheckboxChange} />
      I have a parking permit
      {permitInputEnabled ? (
        <Box sx={{ mt: 2 }}>
          <TextField label="Permit Number" name="permit_number" value={permitData.permit_number} onChange={handlePermitInputChange} fullWidth margin="normal" />
          <TextField label="Permit Type" name="permit_type" value={permitData.permit_type} onChange={handlePermitInputChange} fullWidth margin="normal" />
          <TextField
            label="Activation Date"
            type="date"
            name="activate_date"
            value={permitData.activate_date}
            onChange={handlePermitInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Expiration Date"
            type="date"
            name="expiration_date"
            value={permitData.expiration_date}
            onChange={handlePermitInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField label="Campus Location" name="campus_location" value={permitData.campus_location} onChange={handlePermitInputChange} fullWidth margin="normal" />
          <Button variant="contained" onClick={handlePermitSubmit}>Submit Permit Info</Button>
        </Box>
      ) : (
        <Button onClick={() => window.open('https://epark.sheridancollege.ca/', '_blank')}>Apply for Parking Permit</Button>
      )}
    </div>
  );
}

export default PermitInfo;
