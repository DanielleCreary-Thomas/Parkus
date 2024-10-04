import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function CarInfo({ carData, fetchedCarData, handleCarInputChange, handleCarSubmit }) {
  return (
    <div>
      <Typography variant="h5">Car Info</Typography>
      {fetchedCarData ? (
        <Box>
          <p><strong>License Plate:</strong> {fetchedCarData.license_plate_number}</p>
          <p><strong>Province:</strong> {fetchedCarData.province}</p>
          <p><strong>Year:</strong> {fetchedCarData.year}</p>
          <p><strong>Make:</strong> {fetchedCarData.make}</p>
          <p><strong>Model:</strong> {fetchedCarData.model}</p>
          <p><strong>Color:</strong> {fetchedCarData.color}</p>
        </Box>
      ) : (
        <p>No car information found. Please add your car details below.</p>
      )}
      <Box sx={{ mt: 2 }}>
        <TextField label="Province" name="province" value={carData.province} onChange={handleCarInputChange} fullWidth margin="normal" />
        <TextField label="Year" name="year" value={carData.year} onChange={handleCarInputChange} fullWidth margin="normal" />
        <TextField label="Make" name="make" value={carData.make} onChange={handleCarInputChange} fullWidth margin="normal" />
        <TextField label="Model" name="model" value={carData.model} onChange={handleCarInputChange} fullWidth margin="normal" />
        <TextField label="Color" name="color" value={carData.color} onChange={handleCarInputChange} fullWidth margin="normal" />
        <Button variant="contained" onClick={handleCarSubmit}>Submit Car Info</Button>
      </Box>
    </div>
  );
}

export default CarInfo;
