import React from 'react';
import { Box, Typography, Button, Checkbox, TextField } from '@mui/material';

const PermitInfo = ({
  hasPermit,
  permits,
  permitData,
  permitInputEnabled,
  setPermitInputEnabled,
  handlePermitInputChange,
  handlePermitSubmit,
  handleOpenModal,
  handleImageUpload,
  imagePreviewUrl,
  selectedImage,
  handleSubmit,
  user,
  groupid, 
  isPermitHolder 
}) => {

  // If the user is in a group but not the permit holder, show the restricted message
  if (groupid && !isPermitHolder) {
    return (
      <Box sx={{ flex: 1 }}>
        <Button onClick={() => window.open('https://epark.sheridancollege.ca/', '_blank')} fullWidth>
          Apply for Parking Permit
        </Button>
        <Typography variant="h6" color="error">
          Sorry, you are already in a group. 
          <br/>
          Please exit the group and come back to apply and submit permit info.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      {hasPermit ? (
        <Box sx={{ flex: 1 }}>
          {permits.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {permits.map((permit) => (
                <Box key={permit.permitid} sx={{ padding: 1, borderBottom: '1px solid #ccc' }}>
                  <Typography><strong>Permit Number:</strong> {permit.permit_number}</Typography>
                  <Typography><strong>Permit Type:</strong> {permit.permit_type}</Typography>
                  <Typography><strong>Activation Date:</strong> {permit.activate_date}</Typography>
                  <Typography><strong>Expiration Date:</strong> {permit.expiration_date}</Typography>
                  <Typography><strong>Campus Location:</strong> {permit.campus_location}</Typography>
                  <Typography><strong>Active Status:</strong> {permit.active_status ? 'Active' : 'Inactive'}</Typography>
                  <Button variant="contained" onClick={() => handleOpenModal(permit)} sx={{ mt: 1 }}>
                    Edit Permit
                  </Button>
                  {/* File Upload Section */}
                  <section>
                    <Typography variant={"h6"}>Upload your proof of permit</Typography>
                    <input type="file" accept="image/*" onChange={handleImageUpload} aria-label="Upload proof of permit" />
                    <button onClick={handleSubmit} disabled={!selectedImage}>Submit</button>
                    {imagePreviewUrl && (
                      <div>
                        <h3>Image Preview:</h3>
                        <img src={imagePreviewUrl} alt="Selected Proof" style={{ width: '300px', marginTop: '10px' }} />
                      </div>
                    )}
                    {user && user.image_proof_url && (
                      <div>
                        <h3>Uploaded Proof of Permit:</h3>
                        <img src={user.image_proof_url} alt="Uploaded Proof" style={{ width: '300px', marginTop: '10px' }} />
                      </div>
                    )}
                  </section>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>No parking permits found.</Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ flex: 1 }}>
          <Checkbox checked={permitInputEnabled} onChange={(e) => setPermitInputEnabled(e.target.checked)} />
          I have a parking permit
          {permitInputEnabled ? (
            <Box sx={{ mt: 2 }}>
              {/* Permit submission form */}
              <TextField label="Permit Number" name="permit_number" required value={permitData.permit_number} onChange={handlePermitInputChange} fullWidth margin="normal" />
              <TextField select label="Permit Type" name="permit_type" required value={permitData.permit_type} onChange={handlePermitInputChange} fullWidth margin="normal" SelectProps={{ native: true }}>
                <option value=""></option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
              </TextField>
              <TextField label="Activation Date" type="date" name="activate_date" required value={permitData.activate_date} onChange={handlePermitInputChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              <TextField label="Expiration Date" type="date" name="expiration_date" required value={permitData.expiration_date} onChange={handlePermitInputChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              <TextField select label="Active Status" name="active_status" required value={permitData.active_status} onChange={handlePermitInputChange} fullWidth margin="normal" SelectProps={{ native: true }}>
                <option value=""></option>
                <option value="TRUE">Active</option>
                <option value="FALSE">Inactive</option>
              </TextField>
              <TextField select label="Campus Location" name="campus_location" required value={permitData.campus_location} onChange={handlePermitInputChange} fullWidth margin="normal" SelectProps={{ native: true }}>
                <option value=""></option>
                <option value="Trafalgar Campus">Trafalgar Campus</option>
                <option value="Davis Campus">Davis Campus</option>
              </TextField>
              <Button variant="contained" onClick={handlePermitSubmit} fullWidth>
                Submit Permit Info
              </Button>
            </Box>
          ) : (
            <Button onClick={() => window.open('https://epark.sheridancollege.ca/', '_blank')} fullWidth>
              Apply for Parking Permit
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PermitInfo;
