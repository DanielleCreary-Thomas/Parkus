import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase.ts';
import { fetchUser, checkParkingPermit, addParkingPermit, fetchParkingPermits } from '../services/requests.js';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [hasPermit, setHasPermit] = useState(false);
  const [permitInputEnabled, setPermitInputEnabled] = useState(false);
  const [permitData, setPermitData] = useState({
    permit_number: '',
    active_status: false,
    permit_type: '',
    activate_date: '',
    expiration_date: '',
    campus_location: '',
  });
  const [permits, setPermits] = useState([]); // State to store parking permits

  useEffect(() => {
    // Fetch the currently signed-in user's details
    const fetchUserId = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Error fetching authenticated user:', error);
          setError('Failed to fetch authenticated user.');
          return;
        }

        if (user) {
          setUserId(user.id); // Set the authenticated user's ID
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
    if (!userId) return;

    // Fetch user data from the backend API
    fetchUser(userId)
      .then(data => setUser(data))
      .catch(error => {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user data.');
      });

    // Check if the user has a parking permit
    checkParkingPermit(userId)
      .then(data => {
        setHasPermit(data.has_permit);
        setPermitInputEnabled(data.has_permit);
        if (data.has_permit) {
          fetchUserPermits(); // Fetch permits if the user has them
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
      setPermits(permits); // Set the fetched permits
    } catch (error) {
      console.error('Error fetching parking permits:', error);
      setError('Failed to fetch parking permits.');
    }
  };

  const handlePermitInputChange = (e) => {
    const { name, value } = e.target;
    setPermitData(prev => ({ ...prev, [name]: value }));
  };

  const handleActiveStatusChange = (e) => {
    setPermitData(prev => ({ ...prev, active_status: e.target.value === 'Active' }));
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
      setPermitData({
        permit_number: '',
        active_status: false,
        permit_type: '',
        activate_date: '',
        expiration_date: '',
        campus_location: '',
      });
      fetchUserPermits(); // Fetch updated permits after adding
    } catch (error) {
      console.error('Error adding permit:', error);
      setError('Failed to add permit.');
    }
  };

  const handleCheckboxChange = (event) => {
    setPermitInputEnabled(event.target.checked);
    setHasPermit(event.target.checked); // Adjust the permit status based on checkbox
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Left Section: User Profile */}
      <div style={{ flex: 1 }}>
        <h1>User Profile</h1>
        {error && <p>{error}</p>}
        {user ? (
          <div>
            <p>First Name: {user.first_name}</p>
            <p>Last Name: {user.last_name}</p>
            <p>Student ID: {user.studentid}</p>
            <p>Phone Number: {user.phone_number}</p>
            <p>Email: {user.email}</p>
            <p>Group ID: {user.groupid}</p>
            <p>License Plate: {user.license_plate_number}</p>
            <p>eTransfer Proof: {user.eTransferProof}</p>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={permitInputEnabled}
                  onChange={handleCheckboxChange}
                />
                I have a parking permit
              </label>

              {permitInputEnabled ? (
                <div>
                  <input
                    type="text"
                    name="permit_number"
                    value={permitData.permit_number}
                    onChange={handlePermitInputChange}
                    placeholder="Permit Number"
                  />
                  <input
                    type="text"
                    name="permit_type"
                    value={permitData.permit_type}
                    onChange={handlePermitInputChange}
                    placeholder="Permit Type"
                  />
                  <input
                    type="date"
                    name="activate_date"
                    value={permitData.activate_date}
                    onChange={handlePermitInputChange}
                    placeholder="Activation Date"
                  />
                  <input
                    type="date"
                    name="expiration_date"
                    value={permitData.expiration_date}
                    onChange={handlePermitInputChange}
                    placeholder="Expiration Date"
                  />
                  <input
                    type="text"
                    name="campus_location"
                    value={permitData.campus_location}
                    onChange={handlePermitInputChange}
                    placeholder="Campus Location"
                  />
                  <label>
                    Active Status:
                    <select
                      name="active_status"
                      value={permitData.active_status ? 'Active' : 'Inactive'}
                      onChange={handleActiveStatusChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>
                  <button onClick={handlePermitSubmit}>
                    Submit Permit Details
                  </button>
                </div>
              ) : (
                <button onClick={() => window.open('https://epark.sheridancollege.ca/', '_blank')}>
                  Apply for Parking Permit
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>Loading user data...</p> // Display while fetching data
        )}
      </div>

      {/* Right Section: Parking Permits */}
      <div style={{ flex: 1 }}>
        <h2>Parking Permits</h2>
        {permits.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Permit Number</th>
                <th>Permit Type</th>
                <th>Activate Date</th>
                <th>Expiration Date</th>
                <th>Campus Location</th>
                <th>Active Status</th>
              </tr>
            </thead>
            <tbody>
              {permits.map((permit) => (
                <tr key={permit.permitid}>
                  <td>{permit.permit_number}</td>
                  <td>{permit.permit_type}</td>
                  <td>{permit.activate_date}</td>
                  <td>{permit.expiration_date}</td>
                  <td>{permit.campus_location}</td>
                  <td>{permit.active_status ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No parking permits found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
