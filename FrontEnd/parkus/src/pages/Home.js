import React, { useEffect, useState } from 'react';
import { getCurrUser, fetchUser, getGroupMembers, fetchUserSchedule, fetchGroupMembersSchedules, checkGroupFullyPaid } from '../services/requests';
import './styles/home.css'; 

// Notification component
function NotificationBanner() {
  return (
    <div className="notification-banner">
      <div className="notification-icon">!</div>
      <div className="notification-text">Payment Pending</div>
    </div>
  );
}

function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userId, setUserId] = useState('');
  const [groupId, setGroupId] = useState(''); 
  const [groupMembers, setGroupMembers] = useState([]); 
  const [groupSchedules, setGroupSchedules] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [showNotification, setShowNotification] = useState(false);

  const getCurrentDayOfWeek = () => currentDate.getDay();

  const normalizeDow = (dow) => {
    const dayMap = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6,
    };
    return dayMap[dow] || parseInt(dow, 10);
  };

  const checkFullyPaidStatus = async (groupId) => {
    try {
      const data = await checkGroupFullyPaid(groupId); 
      setShowNotification(data.show_notification); 
    } catch (err) {
      console.error("Error fetching fully paid status:", err);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userId = await getCurrUser();  // Fetch userId using getCurrUser
      if (userId !== -1) {
        setUserId(userId);  // Set the userId state
        const userData = await fetchUser(userId); 
        if (userData) {
          setFirstName(userData.first_name);
          setLastName(userData.last_name);

          // Fetch the current user's schedule
          try {
            const userScheduleData = await fetchUserSchedule(userId); // Fetch the schedule by userId
            if (userScheduleData) {
              const currentDay = getCurrentDayOfWeek();
              const todayUserSchedules = userScheduleData.filter(
                (block) => block && normalizeDow(block.dow) === currentDay
              );
              setGroupSchedules(todayUserSchedules); // Use the same groupSchedules state
            }
          } catch (err) {
            setError("Failed to fetch user's schedule.");
          }

          if (userData.groupid) {
            setGroupId(userData.groupid);

            // Fetch fully paid status
            checkFullyPaidStatus(userData.groupid); // Check if fully_paid is false

            // Fetch group members
            try {
              const membersData = await getGroupMembers(userData.groupid);
              if (membersData) {
                const validMembers = membersData.filter(
                  (member) => member.first_name && member.last_name
                );
                setGroupMembers(validMembers || []);
              }
            } catch (err) {
              setError("Failed to fetch group members.");
            }

            // Fetch group schedules
            try {
              const schedulesData = await fetchGroupMembersSchedules(userData.groupid);
              if (schedulesData) {
                const currentDay = getCurrentDayOfWeek();
                const todaySchedules = schedulesData.filter(
                  (block) => block && normalizeDow(block.dow) === currentDay
                );
                // Merge the current user's schedule with the group schedules
                setGroupSchedules((prev) => [...prev, ...todaySchedules]);
              }
            } catch (err) {
              setError("Failed to fetch group schedules.");
            }
          }
        } else {
          setError("User data not found.");
        }
      } else {
        setError("User is not authenticated.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("An error occurred while fetching user data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [currentDate]);

  return (
    <div className="home-container">
    <div className="home-header-panel"> {/* New panel */}
      <div className="home-header">
        <h1>Welcome, {firstName} {lastName}</h1>
        {showNotification && <NotificationBanner />} 
      </div>
    </div>
  
    <div className="home-main-content">
      <div className="home-left-panel">
        <h2>Permit Group</h2>
        <div className="left-panel-content">
          {loading ? (
            <p>Loading group members...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : groupMembers.length > 0 ? (
            <ul>
              {groupMembers.map((member, index) => (
                <li key={index}>
                  {member.first_name} {member.last_name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No group members found.</p>
          )}
        </div>
      </div>
  
      <div className="home-right-panel">
        <h2>Today's Schedule</h2>
  
        <div className="home-calendar">
          <div className="home-calendar-timeline">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="home-calendar-hour">
                {i + 8}:00
              </div>
            ))}
          </div>
  
          <div className="home-calendar-events">
            {groupSchedules.length > 0 ? (
              groupSchedules.map((block, index) => {
                const startHour = parseInt(block.start_time.split(':')[0], 10);
                const endHour = parseInt(block.end_time.split(':')[0], 10);
                const startMinute = parseInt(block.start_time.split(':')[1], 10);
                const endMinute = parseInt(block.end_time.split(':')[1], 10);
  
                const topPosition = (startHour - 8) * 40 + (startMinute / 60) * 40;
                const height = (endHour - startHour) * 40 + ((endMinute - startMinute) / 60) * 40;
  
                const isCurrentUser = block.user_id === userId;
  
                return (
                  <div
                    key={index}
                    className={`home-calendar-event ${isCurrentUser ? 'current-user' : 'other-user'}`}
                    style={{ top: `${topPosition}px`, height: `${height}px`, marginBottom: '2px' }}
                  >
                    <div className="event-time"><strong>{block.start_time} - {block.end_time}</strong></div>
                    <div className="event-description">{block.description || 'No Description'}</div>
                    <div className="event-person"><strong>{block.first_name} {block.last_name}</strong></div>
                  </div>
                );
              })
            ) : (
              <div className="no-schedule">No schedule for today.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default Home;
