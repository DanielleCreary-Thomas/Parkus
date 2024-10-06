// import React, { useEffect, useState } from 'react';
// import { supabase } from '../utils/supabase.ts';
// import { fetchUser, checkParkingPermit, addParkingPermit, fetchParkingPermits, fetchCarByUserId, addCar } from '../services/requests.js';
// import { Box, Card, Typography, Tabs, Tab, Button, TextField, Checkbox } from '@mui/material';

// function TabPanel({ children, value, index }) {
//   return (
//     <div role="tabpanel" hidden={value !== index}>
//       {value === index && <Box p={3}>{children}</Box>}
//     </div>
//   );
// }

// const Profile = () => {
//   const [value, setValue] = useState(0);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [hasPermit, setHasPermit] = useState(false);
//   const [permitInputEnabled, setPermitInputEnabled] = useState(false);
//   const [permits, setPermits] = useState([]);
//   const [permitData, setPermitData] = useState({
//     permit_number: '',
//     active_status: false,
//     permit_type: '',
//     activate_date: '',
//     expiration_date: '',
//     campus_location: '',
//   });
//   const [carData, setCarData] = useState({
//     license_plate_number: '',
//     province: '',
//     year: '',
//     make: '',
//     model: '',
//     color: ''
//   });
//   const [fetchedCarData, setFetchedCarData] = useState(null);
//   const [error, setError] = useState(null);

//   // Handle tab change
//   const handleTabChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   useEffect(() => {
//     const fetchUserId = async () => {
//       try {
//         const { data: { user }, error } = await supabase.auth.getUser();
//         if (error) {
//           console.error('Error fetching authenticated user:', error);
//           setError('Failed to fetch authenticated user.');
//           return;
//         }
//         if (user) {
//           setUserId(user.id);
//           fetchUserCar(user.id);
//         } else {
//           setError('No user is currently signed in.');
//         }
//       } catch (err) {
//         console.error('Error fetching user session:', err);
//         setError('Error retrieving user session.');
//       }
//     };
//     fetchUserId();
//   }, []);

//   // Fetch car data using the user's ID
//   const fetchUserCar = async (userId) => {
//     try {
//       const car = await fetchCarByUserId(userId);
//       setFetchedCarData(car);
//       if (car) {
//         setCarData({
//           license_plate_number: car.license_plate_number,
//           province: car.province,
//           year: car.year,
//           make: car.make,
//           model: car.model,
//           color: car.color
//         });
//       }
//     } catch (error) {
//       setError('No car information found for this user.');
//     }
//   };

//   // Fetch user permits
//   useEffect(() => {
//     if (!userId) return;

//     fetchUser(userId)
//       .then(data => setUser(data))
//       .catch(error => {
//         console.error('Error fetching user:', error);
//         setError('Failed to fetch user data.');
//       });

//     checkParkingPermit(userId)
//       .then(data => {
//         setHasPermit(data.has_permit);
//         setPermitInputEnabled(data.has_permit);
//         if (data.has_permit) {
//           fetchUserPermits();
//         }
//       })
//       .catch(error => {
//         console.error('Error checking parking permit:', error);
//         setError('Failed to check parking permit.');
//       });
//   }, [userId]);

//   const fetchUserPermits = async () => {
//     try {
//       const permits = await fetchParkingPermits(userId);
//       setPermits(permits);
//     } catch (error) {
//       console.error('Error fetching parking permits:', error);
//       setError('Failed to fetch parking permits.');
//     }
//   };

//   const handlePermitInputChange = (e) => {
//     const { name, value } = e.target;
//     setPermitData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCarInputChange = (e) => {
//     const { name, value } = e.target;
//     setCarData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCheckboxChange = (event) => {
//     setPermitInputEnabled(event.target.checked);
//     setHasPermit(event.target.checked);
//   };

//   const handlePermitSubmit = async () => {
//     if (!userId) return;
//     try {
//       await addParkingPermit({
//         userid: userId,
//         ...permitData,
//       });
//       alert('Permit added successfully!');
//       setHasPermit(true);
//       setPermitInputEnabled(true);
//       fetchUserPermits();
//     } catch (error) {
//       console.error('Error adding permit:', error);
//       setError('Failed to add permit.');
//     }
//   };

//   const handleCarSubmit = async () => {
//     if (!userId) return;
//     try {
//       await addCar({
//         userid: userId,
//         ...carData,
//       });
//       alert('Car information added successfully!');
//       fetchUserCar(userId);
//     } catch (error) {
//       console.error('Error adding car information:', error);
//       setError('Failed to add car information.');
//     }
//   };

//   return (
//     <Card sx={{ maxWidth: 800, margin: 'auto', padding: '20px' }}>
//       <Tabs value={value} onChange={handleTabChange} centered>
//         <Tab label="User Info" />
//         <Tab label="Car Info" />
//         <Tab label="Permit Info" />
//       </Tabs>

//       <TabPanel value={value} index={0}>
//         {user ? (
//           <Box>
//             <Typography variant="h5">User Info</Typography>
//             <p>First Name: {user.first_name}</p>
//             <p>Last Name: {user.last_name}</p>
//             <p>Student ID: {user.studentid}</p>
//             <p>Phone Number: {user.phone_number}</p>
//             <p>Email: {user.email}</p>
//           </Box>
//         ) : (
//           <p>Loading user data...</p>
//         )}
//       </TabPanel>

//       <TabPanel value={value} index={1}>
//         <Typography variant="h5">Car Info</Typography>
//         {fetchedCarData ? (
//           <Box>
//             <p><strong>License Plate:</strong> {fetchedCarData.license_plate_number}</p>
//             <p><strong>Province:</strong> {fetchedCarData.province}</p>
//             <p><strong>Year:</strong> {fetchedCarData.year}</p>
//             <p><strong>Make:</strong> {fetchedCarData.make}</p>
//             <p><strong>Model:</strong> {fetchedCarData.model}</p>
//             <p><strong>Color:</strong> {fetchedCarData.color}</p>
//           </Box>
//         ) : (
//           <p>No car information found. Please add your car details below.</p>
//         )}
//         <Box sx={{ mt: 2 }}>
//           <TextField label="Province" name="province" value={carData.province} onChange={handleCarInputChange} fullWidth margin="normal" />
//           <TextField label="Year" name="year" value={carData.year} onChange={handleCarInputChange} fullWidth margin="normal" />
//           <TextField label="Make" name="make" value={carData.make} onChange={handleCarInputChange} fullWidth margin="normal" />
//           <TextField label="Model" name="model" value={carData.model} onChange={handleCarInputChange} fullWidth margin="normal" />
//           <TextField label="Color" name="color" value={carData.color} onChange={handleCarInputChange} fullWidth margin="normal" />
//           <Button variant="contained" onClick={handleCarSubmit}>Submit Car Info</Button>
//         </Box>
//       </TabPanel>

//       <TabPanel value={value} index={2}>
//         <Typography variant="h5">Parking Permit Info</Typography>
//         <Checkbox checked={permitInputEnabled} onChange={handleCheckboxChange} />
//         I have a parking permit
//         {permitInputEnabled ? (
//           <Box sx={{ mt: 2 }}>
//             <TextField label="Permit Number" name="permit_number" value={permitData.permit_number} onChange={handlePermitInputChange} fullWidth margin="normal" />
//             <TextField label="Permit Type" name="permit_type" value={permitData.permit_type} onChange={handlePermitInputChange} fullWidth margin="normal" />
//             <TextField
//               label="Activation Date"
//               type="date"
//               name="activate_date"
//               value={permitData.activate_date}
//               onChange={handlePermitInputChange}
//               InputLabelProps={{
//                 shrink: true, // Ensures that the label stays shrunk above the field
//               }}
//               fullWidth
//               margin="normal"
//             />

//             <TextField
//               label="Expiration Date"
//               type="date"
//               name="expiration_date"
//               value={permitData.expiration_date}
//               onChange={handlePermitInputChange}
//               InputLabelProps={{
//                 shrink: true, // Ensures that the label stays shrunk above the field
//               }}
//               fullWidth
//               margin="normal"
//             />

//             <TextField label="Campus Location" name="campus_location" value={permitData.campus_location} onChange={handlePermitInputChange} fullWidth margin="normal" />
//             <Button variant="contained" onClick={handlePermitSubmit}>Submit Permit Info</Button>
//           </Box>
//         ) : (
//           <Button onClick={() => window.open('https://epark.sheridancollege.ca/', '_blank')}>Apply for Parking Permit</Button>
//         )}
//       </TabPanel>
//     </Card>
//   );
// };

// export default Profile;


import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase.ts';
import { fetchUser, checkParkingPermit, addParkingPermit, fetchParkingPermits, fetchCarByUserId, addCar } from '../services/requests.js';
import { Box, Card, Typography, Tabs, Tab, Button, TextField, Checkbox } from '@mui/material';
import ProfileTitle from '../components/Profile/ProfileTitle/ProfileTitle.js';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [hasPermit, setHasPermit] = useState(false);
  const [permitInputEnabled, setPermitInputEnabled] = useState(false);
  const [permits, setPermits] = useState([]);
  const [permitData, setPermitData] = useState({
    permit_number: '',
    active_status: false,
    permit_type: '',
    activate_date: '',
    expiration_date: '',
    campus_location: ''
  });
  const [carData, setCarData] = useState({
    license_plate_number: '',
    province: '',
    year: '',
    make: '',
    model: '',
    color: ''
  });
  const [fetchedCarData, setFetchedCarData] = useState(null);
  const [error, setError] = useState(null);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching authenticated user:', error);
          setError('Failed to fetch authenticated user.');
          return;
        }
        if (user) {
          setUserId(user.id);
          fetchUserCar(user.id);
        } else {
          setError('No user is currently signed in.');
        }
      } catch (err) {
        console.error('Error fetching user session:', err);
        setError('Error retrieving user session.');
      }
    };
    fetchUserId();
  }, []);

  const fetchUserCar = async (userId) => {
    try {
      const car = await fetchCarByUserId(userId);
      setFetchedCarData(car);
      if (car) {
        setCarData({
          license_plate_number: car.license_plate_number,
          province: car.province,
          year: car.year,
          make: car.make,
          model: car.model,
          color: car.color
        });
      }
    } catch (error) {
      setError('No car information found for this user.');
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchUser(userId)
      .then(data => setUser(data))
      .catch(error => {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user data.');
      });

    checkParkingPermit(userId)
      .then(data => {
        setHasPermit(data.has_permit);
        setPermitInputEnabled(data.has_permit);
        if (data.has_permit) {
          fetchUserPermits();
        }
      })
      .catch(error => {
        console.error('Error checking parking permit:', error);
        setError('Failed to check parking permit.');
      });
  }, [userId]);

  const fetchUserPermits = async () => {
    try {
      const permits = await fetchParkingPermits(userId);
      setPermits(permits);
    } catch (error) {
      console.error('Error fetching parking permits:', error);
      setError('Failed to fetch parking permits.');
    }
  };

  const handlePermitInputChange = (e) => {
    const { name, value } = e.target;
    setPermitData(prev => ({ ...prev, [name]: value }));
  };

  const handleCarInputChange = (e) => {
    const { name, value } = e.target;
    setCarData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    setPermitInputEnabled(event.target.checked);
    setHasPermit(event.target.checked);
  };

  const handlePermitSubmit = async () => {
    if (!userId) return;
    try {
      await addParkingPermit({
        userid: userId,
        ...permitData,
      });
      alert('Permit added successfully!');
      setHasPermit(true);
      setPermitInputEnabled(true);
      fetchUserPermits();
    } catch (error) {
      console.error('Error adding permit:', error);
      setError('Failed to add permit.');
    }
  };

  const handleCarSubmit = async () => {
    if (!userId) return;
    try {
      await addCar({
        userid: userId,
        ...carData,
      });
      alert('Car information added successfully!');
      fetchUserCar(userId);
    } catch (error) {
      console.error('Error adding car information:', error);
      setError('Failed to add car information.');
    }
  };

  return (
    <>
      <ProfileTitle /> {/* Profile title displayed outside the card */}
      <Card sx={{ maxWidth: 800, margin: 'auto', padding: '20px' }}>
        <Tabs value={value} onChange={handleTabChange} centered>
          <Tab label="User Info" />
          <Tab label="Car Info" />
          <Tab label="Permit Info" />
        </Tabs>

        <TabPanel value={value} index={0}>
          {user ? (
            <Box>
              <p>First Name: {user.first_name}</p>
              <p>Last Name: {user.last_name}</p>
              <p>Student ID: {user.studentid}</p>
              <p>Phone Number: {user.phone_number}</p>
              <p>Email: {user.email}</p>
            </Box>
          ) : (
            <p>Loading user data...</p>
          )}
        </TabPanel>

        <TabPanel value={value} index={1}>
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
            <TextField
              label="Province"
              name="province"
              value={carData.province}
              onChange={handleCarInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Year"
              name="year"
              value={carData.year}
              onChange={handleCarInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Make"
              name="make"
              value={carData.make}
              onChange={handleCarInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Model"
              name="model"
              value={carData.model}
              onChange={handleCarInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Color"
              name="color"
              value={carData.color}
              onChange={handleCarInputChange}
              fullWidth
              margin="dense"
            />
            <Button
              variant="contained"
              onClick={handleCarSubmit}
              sx={{ mt: 2 }}
            >
              Submit Car Info
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={2}>
  <Typography variant="h5">Parking Permit Info</Typography>
  <Checkbox checked={permitInputEnabled} onChange={handleCheckboxChange} />
  I have a parking permit
  {permitInputEnabled ? (
    <Box sx={{ mt: 2 }}>
      <TextField
        label="Permit Number"
        name="permit_number"
        value={permitData.permit_number}
        onChange={handlePermitInputChange}
        fullWidth
        margin="normal"
      />

      {/* Permit Type Dropdown */}
      <TextField
        select
        label="Permit Type"
        name="permit_type"
        value={permitData.permit_type}
        onChange={handlePermitInputChange}
        fullWidth
        margin="normal"
        SelectProps={{
          native: true,
        }}
      >
        <option value=""></option> {/* Default empty option */}
        <option value="Virtual">Virtual</option>
        <option value="Physical">Physical</option>
      </TextField>

      <TextField
        label="Activation Date"
        type="date"
        name="activate_date"
        value={permitData.activate_date}
        onChange={handlePermitInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Expiration Date"
        type="date"
        name="expiration_date"
        value={permitData.expiration_date}
        onChange={handlePermitInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        margin="normal"
      />

      {/* Campus Location Dropdown */}
      <TextField
        select
        label="Campus Location"
        name="campus_location"
        value={permitData.campus_location}
        onChange={handlePermitInputChange}
        fullWidth
        margin="normal"
        SelectProps={{
          native: true,
        }}
      >
        <option value=""></option> {/* Default empty option */}
        <option value="Trafalgar Campus">Trafalgar Campus</option>
        <option value="Davis Campus">Davis Campus</option>
      </TextField>

      <Button variant="contained" onClick={handlePermitSubmit}>
        Submit Permit Info
      </Button>
    </Box>
  ) : (
    <Button onClick={() => window.open('https://epark.sheridancollege.ca/', '_blank')}>
      Apply for Parking Permit
    </Button>
  )}
</TabPanel>

      </Card>
    </>
  );
};

export default Profile;
