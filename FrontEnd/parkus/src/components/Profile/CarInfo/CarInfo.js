import React from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';

const CarInfo = ({ carData, fetchedCarData, handleCarInputChange, handleCarSubmit }) => {
  return (
    <>
      {fetchedCarData ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'left', width: '100%' }}>
            <Typography><strong>License Plate:</strong> {fetchedCarData.license_plate_number}</Typography>
            <Typography><strong>Province:</strong> {fetchedCarData.province}</Typography>
            <Typography><strong>Year:</strong> {fetchedCarData.year}</Typography>
            <Typography><strong>Make:</strong> {fetchedCarData.make}</Typography>
            <Typography><strong>Model:</strong> {fetchedCarData.model}</Typography>
            <Typography><strong>Color:</strong> {fetchedCarData.color}</Typography>
          </Box>
        </Box>
      ) : (
        <Typography>No car information found. Please add your car details below.</Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', margin: '20px auto' }}>
        <TextField label="Province" name="province" value={carData.province} onChange={handleCarInputChange} fullWidth margin="dense" />
        <TextField label="Year" name="year" value={carData.year} onChange={handleCarInputChange} fullWidth margin="dense" />
        <TextField label="Make" name="make" value={carData.make} onChange={handleCarInputChange} fullWidth margin="dense" />
        <TextField label="Model" name="model" value={carData.model} onChange={handleCarInputChange} fullWidth margin="dense" />
        <TextField label="Color" name="color" value={carData.color} onChange={handleCarInputChange} fullWidth margin="dense" />
        <Button variant="contained" onClick={handleCarSubmit} sx={{ mt: 2 }}>
          Update Car Info
        </Button>
      </Box>
    </>
  );
};

export default CarInfo;
