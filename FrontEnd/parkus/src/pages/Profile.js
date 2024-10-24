import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase.ts';
import { fetchUser, checkParkingPermit, checkUserImageProof, getGroupId, getCurrUser, addParkingPermit, fetchParkingPermits, fetchCarByUserId, addCar, getPermitId, addParkingGroup, uploadETransfer, fetchGroupId, updatePermit, updateUserGroupId } from '../services/requests.js'; // Importing all functions
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
  const [groupId, setGroupId] = useState(null);
  const [hasPermit, setHasPermit] = useState(false);
  const [permitInputEnabled, setPermitInputEnabled] = useState(false);
  const [permits, setPermits] = useState([]);
  const [isMemberOfGroup, setIsMemberOfGroup] = useState(false);
  const [uploadImageUrl, setUploadImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [userImageProof, setUserImageProof] = useState(false);
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

  useEffect(() => {
    async function init() {

      var userid = await getCurrUser();
      console.log(userid);

      var groupid = await getGroupId(userid);
      console.log(groupId);

      var imageProof = await checkUserImageProof(userid)
      console.log(imageProof)


      if (groupid !== 'None') {
        setIsMemberOfGroup(true)
        setUserId(userid)
        setUserImageProof(imageProof)
        setGroupId(groupid)
        console.log("member of group", isMemberOfGroup)
      }

    }
    init();


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

    // Validate required fields
    if (!permitData.permit_number || permitData.permit_number.trim() === '') {
      toast.error('Permit Number is missing.');
      return;
    }
    if (!permitData.permit_type || permitData.permit_type.trim() === '') {
      toast.error('Permit Type is missing.');
      return;
    }

    if (new Date(permitData.activate_date) >= new Date(permitData.expiration_date)) {
      toast.error('Expiration Date must be later than Activation date');
      return;
    }

    if (!permitData.activate_date || permitData.activate_date.trim() === '') {
      toast.error('Activation Date is missing.');
      return;
    }
    if (!permitData.expiration_date || permitData.expiration_date.trim() === '') {
      toast.error('Expiration Date is missing.');
      return;
    }
    if (!permitData.active_status) {
      toast.error('Active Status is missing.');
      return;
    }
    if (!permitData.campus_location || permitData.campus_location.trim() === '') {
      toast.error('Campus Location is missing.');
      return;
    }

    try {
      const checkPermitExists = await checkParkingPermit(userId); // Using the function from requests.js
      if (checkPermitExists && checkPermitExists.has_permit) {
        toast.error('Parking permit already exists for this user.');
        return;
      }

      // Add parking permit
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

            // Fetch the group ID based on the permit ID
            const groupIdResponse = await fetchGroupId({ permitId: permitIdResponse.permitid });

            if (groupIdResponse && groupIdResponse.groupid) {
              // Update the user's group ID in the backend, but don't show any error messages
              await updateUserGroupId({ userid: userId, groupid: groupIdResponse.groupid });
            }
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

    if (new Date(permitData.activate_date) >= new Date(permitData.expiration_date)) {
      toast.error('Activation date cannot be later than or equal to the expiration date.');
      return;
    }

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
      alert('Please select an image to upload.');
      return;
    }

    const url = await uploadProof(selectedImage);

    console.log("outside", url)

    if (url !== undefined) {
      const formData = new FormData();
      formData.append('proofImageUrl', url);
      formData.append('userid', userId)
      try {
        const response = await uploadETransfer(formData);
        console.log(response);
        if (response['urlUploaded'] === true) {
          console.log("image uploaded successfully")
          // Reset the form
          setSelectedImage(null);
          setImagePreviewUrl(null);
          setUploadImageUrl(null);
          toast.success("Image uploaded successfully")
        }

      } catch (error) {
        console.log("error uploading image", error);
        toast.error("An error occurred while uploading image, Try Again", error);
      }
    } else {
      toast.error("An error occurred while uploading image, Try Again");
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
    let outerError;
    if (!userImageProof) {//if the user has no image proof
      let { data, error } =
        await supabase.storage.from('permit_confirmation').upload(userId, file)
      outerError = error
    } else {
      let { data, error } =
        await supabase.storage.from('permit_confirmation').update(userId, file)
      outerError = error
    }
    if (outerError) {
      // Handle error
      console.log(outerError)
    } else {
      // Handle success
      let data = supabase.storage.from('permit_confirmation').getPublicUrl(userId)
      console.log("immediate after url call")
      const url = data.data['publicUrl']
      console.log(url)
      return url

    }
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
            groupid={user?.groupid}
            isPermitHolder={hasPermit}
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