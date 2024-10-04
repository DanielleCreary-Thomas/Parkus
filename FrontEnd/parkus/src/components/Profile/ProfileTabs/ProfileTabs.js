import { Tabs, Tab } from '@mui/material';
import React from 'react';

function ProfileTabs({ value, handleTabChange }) {
  return (
    <Tabs value={value} onChange={handleTabChange} centered>
      <Tab label="User Info" />
      <Tab label="Car Info" />
      <Tab label="Permit Info" />
    </Tabs>
  );
}

export default ProfileTabs;
