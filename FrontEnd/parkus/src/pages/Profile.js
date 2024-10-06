import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase.ts';
import { fetchUser, checkParkingPermit, addParkingPermit, fetchParkingPermits, fetchCarByUserId, addCar, getPermitId, addParkingGroup, uploadETransfer, updatePermit } from '../services/requests.js'; // Importing all functions
import { Box, Card, Typography, Tabs, Tab, Button, TextField, Checkbox, Modal } from '@mui/material';
import ProfileTitle from '../components/Profile/ProfileTitle/ProfileTitle.js';
import EditPermitModal from '../components/Profile/EditPermitModal/EditPermitModal.js';
import UserInfo from '../components/Profile/UserInfo/UserInfo.js';
import CarInfo from '../components/Profile/CarInfo/CarInfo.js';
import PermitInfo from '../components/Profile/PermitInfo/PermitInfo.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [uploadImageUrl, setUploadImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
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
  const [openModal, setOpenModal] = useState(false);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenModal = (permit) => {
    setPermitData({
      permit_number: permit.permit_number || '',
      permit_type: permit.permit_type || '',
      activate_date: permit.activate_date || '',
      expiration_date: permit.expiration_date || '',
      campus_location: permit.campus_location || '',
      active_status: permit.active_status ? 'TRUE' : 'FALSE',
      userid: permit.userid || userId,
      permitid: permit.permitid
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
          fetchUserCar(user.id); // Fetch car info
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
      const car = await fetchCarByUserId(userId); // Using the utility function from requests.js
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
          fetchUserPermits(); // Fetch permits
        }
      })
      .catch(error => {
        console.error('Error checking parking permit:', error);
        setError('Failed to check parking permit.');
      });
  }, [userId]);

  const fetchUserPermits = async () => {
    try {
      const permits = await fetchParkingPermits(userId); // Using the function from requests.js
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

  const handlePermitSubmit = async () => {
    if (!userId) {
      toast.error('User ID is missing.');
      return;
    }
    try {
      const checkPermitExists = await checkParkingPermit(userId); // Using the function from requests.js
      if (checkPermitExists && checkPermitExists.has_permit) {
        toast.error('Parking permit already exists for this user.');
        return;
      }

      const permitResponse = await addParkingPermit({ userid: userId, ...permitData });
      if (permitResponse) {
        const permitIdResponse = await getPermitId({ userid: userId, permit_number: permitData.permit_number });
        if (permitIdResponse && permitIdResponse.permitid) {
          const groupResponse = await addParkingGroup(permitIdResponse.permitid);
          if (groupResponse.error) {
            toast.error(`Error adding parking group: ${groupResponse.error}`);
          } else {
            toast.success('Parking Info added successfully!');
            await fetchUserPermits();  // Re-fetch the permits
            setHasPermit(true);
            setPermitInputEnabled(false);
          }
        } else {
          toast.error('Error retrieving permit ID.');
        }
      } else {
        toast.error('Error adding permit.');
      }
    } catch (error) {
      console.error('Error adding permit or group:', error);
      toast.error('Failed to add permit or parking group.');
    }
  };

  const handleCarSubmit = async () => {
    if (!userId) {
      toast.error('User ID is missing.');
      return;
    }
    try {
      await addCar({ userid: userId, ...carData });
      toast.success('Car information added successfully!');
      fetchUserCar(userId); // Refresh car data
    } catch (error) {
      console.error('Error adding car information:', error);
      toast.error('Failed to add car information.');
    }
  };

  const handleCarInputChange = (e) => {
    const { name, value } = e.target;
    setCarData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermitUpdate = async () => {
    try {
      await updatePermit({ ...permitData });
      toast.success('Permit information updated successfully!');
      handleCloseModal();
      await fetchUserPermits();
    } catch (error) {
      console.error('Error updating permit information:', error);
      toast.error('Failed to update permit information.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error('Please select an image to upload.');
      return;
    }
    try {
      const url = await uploadProof(selectedImage);
      const formData = new FormData();
      formData.append('proofImageUrl', url);
      formData.append('userid', userId);
      const response = await uploadETransfer(formData);
      if (response['urlUploaded'] === true) {
        setSelectedImage(null);
        setImagePreviewUrl(null);
        setUploadImageUrl(null);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image. Please try again.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  async function uploadProof(file) {
    let { data, error } =
      await supabase.storage.from('permit_confirmation').upload(userId + file.name, file);
    if (error) {
      console.error(error);
      return;
    }
    let response = supabase.storage.from('permit_confirmation').getPublicUrl(userId + file.name);
    const url = response.data['publicUrl'];
    return url;
  }

  return (
    <>
      <ProfileTitle />
      <Card sx={{ maxWidth: 800, margin: 'auto', padding: '20px', borderRadius: '30px' }}>
        <Tabs value={value} onChange={handleTabChange} centered>
          <Tab label="User Info" />
          <Tab label="Car Info" />
          <Tab label="Permit Info" />
        </Tabs>

        <TabPanel value={value} index={0}>
          {user ? <UserInfo user={user} /> : <p>Loading user data...</p>}
        </TabPanel>

        <TabPanel value={value} index={1}>
          <CarInfo
            carData={carData}
            fetchedCarData={fetchedCarData}
            handleCarInputChange={handleCarInputChange}
            handleCarSubmit={handleCarSubmit}
          />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <PermitInfo
            hasPermit={hasPermit}
            permits={permits}
            permitData={permitData}
            permitInputEnabled={permitInputEnabled}
            setPermitInputEnabled={setPermitInputEnabled}
            handlePermitInputChange={handlePermitInputChange}
            handlePermitSubmit={handlePermitSubmit}
            handleOpenModal={handleOpenModal}
            handleImageUpload={handleImageUpload}
            imagePreviewUrl={imagePreviewUrl}
            selectedImage={selectedImage}
            handleSubmit={handleSubmit}
            user={user}
          />
        </TabPanel>
      </Card>

      <EditPermitModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        permitData={permitData}
        handlePermitInputChange={handlePermitInputChange}
        handlePermitUpdate={handlePermitUpdate}
      />

      <ToastContainer />
    </>
  );
};

export default Profile;
