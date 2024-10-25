import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrUser, fetchUser, getGroupMembers, fetchUserSchedule, fetchGroupMembersSchedules, hasMemberPaid, isGroupLeader, checkPermitExpiration } from '../services/requests'; // Import the necessary functions
import './styles/home.css';



// Notification banner for permit expiring soon
function ExpiringSoonBanner() {
  return (
      <div className="notification-banner expiring-soon">
        <div className="notification-icon">⚠</div>
        <div className="notification-text">Your parking permit is expiring soon!</div>
      </div>
  );
}

// Notification component
function NotificationBanner({ message }) {
  return (
      <div className="notification-banner">
        <div className="notification-icon">!</div>
        <div className="notification-text">{message}</div>
      </div>
  );
}

function formatCurrentDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString(undefined, options);

  // Custom reordering of the date components
  const parts = formattedDate.split(" ");
  return `${parts[0]} ${parts[2]} ${parts[1]} ${parts[3]}`; // Reorder the day and month
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
  const [notificationMessage, setNotificationMessage] = useState(''); // New state for the notification message
  const [showExpiringSoonNotification, setShowExpiringSoonNotification] = useState(false);
  const navigate = useNavigate();  // Initialize the navigate hook
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

  // Function to check if the current user has paid using hasMemberPaid
  const checkUserPaymentStatus = async (userId) => {
    try {
      const data = await hasMemberPaid(userId);
      return data; // Return the payment status from hasMemberPaid
    } catch (err) {
      console.error("Error fetching user payment status:", err);
      return true; // Assume paid in case of an error
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userId = await getCurrUser();
      if (userId !== -1) {
        setUserId(userId);
        const userData = await fetchUser(userId);
        if (userData) {
          setFirstName(userData.first_name);
          setLastName(userData.last_name);

          if (userData.groupid) {
            setGroupId(userData.groupid);

            // Check the permit expiration status
            const permitStatus = await checkPermitExpiration(userData.groupid);

            // Console logs for debugging the expiration date and current date
            console.log("Current Date:", new Date());
            if (permitStatus.expiration_date) {
              console.log("Expiration Date:", new Date(permitStatus.expiration_date));
            }

            if (permitStatus.status === 'expired') {
              console.log("Group deactivated because the permit has expired.");
              alert("Your group's permit has expired, and the group has been deactivated.");
              navigate("/signin");
              return; // Stop further processing as the group is deactivated
            } else if (permitStatus.status === 'expiring_soon') {
              setShowExpiringSoonNotification(true);  // Show expiring soon banner
              setNotificationMessage("Your parking permit is expiring soon!");
            } else {
              console.log("Permit is valid.");
            }

            // Check if the current user is the group leader
            const isLeader = await isGroupLeader(userId, userData.groupid);
            console.log("is a leader?" + isLeader);
            if (!isLeader) {
              const hasUserPaid = await checkUserPaymentStatus(userId);
              if (!hasUserPaid) {
                // If payment is pending, show the notification for payment
                setNotificationMessage("Payment Pending");
                setShowNotification(true);
              }
            } else {
              setShowNotification(false); // If leader, no payment notification
            }
          }

          // Fetch the user's schedule
          const userScheduleData = await fetchUserSchedule(userId);
          if (userScheduleData) {
            const currentDay = getCurrentDayOfWeek();
            const todayUserSchedules = userScheduleData.filter(
                (block) => block && normalizeDow(block.dow) === currentDay
            );
            setGroupSchedules(todayUserSchedules);
          }

          // Fetch group members and schedules if the user is in a group
          if (userData.groupid) {
            const membersData = await getGroupMembers(userData.groupid);
            if (membersData) {
              const validMembers = membersData.filter((member) => member.first_name && member.last_name);
              setGroupMembers(validMembers || []);
            }

            const schedulesData = await fetchGroupMembersSchedules(userData.groupid);
            if (schedulesData) {
              const currentDay = getCurrentDayOfWeek();
              const todaySchedules = schedulesData.filter(
                  (block) => block && normalizeDow(block.dow) === currentDay
              );
              setGroupSchedules((prev) => [...prev, ...todaySchedules]);
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
        <div className="home-header-panel">
          <div className="home-header">
            <h1>Welcome, {firstName} {lastName}</h1>
            {showNotification && <NotificationBanner message={notificationMessage} />}
            {showExpiringSoonNotification && <ExpiringSoonBanner />} {/* Show expiring soon banner if set */}
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
            {/* Display the current date as part of the header */}
            <h2>{formatCurrentDate(currentDate)}</h2>
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
