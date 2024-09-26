import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase.ts'; // Import Supabase client

const GroupSchedule = () => {
    const [users, setUsers] = useState([]); // To store users in the selected group
    const [scheduleBlocks, setScheduleBlocks] = useState([]); // To store the fetched schedule blocks for all users
    const [groupId, setGroupId] = useState(1); // Default permit group ID

    // Fetch users for the selected group
    useEffect(() => {
        const fetchUsersForGroup = async () => {
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('userid, first_name, last_name')
                .eq('groupid', groupId);

            if (usersError) {
                console.error('Error fetching users:', usersError);
            } else {
                setUsers(usersData);

                // Fetch schedule blocks for all users in the selected group
                if (usersData.length > 0) {
                    const userIds = usersData.map(user => user.userid);
                    const { data: scheduleData, error: scheduleError } = await supabase
                        .from('schedule_blocks')
                        .select('*')
                        .in('userid', userIds); // Fetch schedule blocks for all users in the group

                    if (scheduleError) {
                        console.error('Error fetching schedule blocks:', scheduleError);
                    } else {
                        setScheduleBlocks(scheduleData);
                    }
                } else {
                    setScheduleBlocks([]); // Clear the schedule if no users found
                }
            }
        };
        fetchUsersForGroup();
    }, [groupId]);

    const handleGroupChange = (e) => {
        setGroupId(e.target.value); // Update group ID when the user selects a new group
    };

    const getDayIndex = (day) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days.indexOf(day);
    };

    const convertTimeToHour = (time) => parseInt(time.split(':')[0], 10);

    return (
        <div className="group-schedule-container">
            <h1>Spotsharing Generation</h1>

            {/* Permit group selection */}
            <div className="group-select">
                <label htmlFor="group">Select Group: </label>
                <select id="group" value={groupId} onChange={handleGroupChange}>
                    <option value={1}>Group 1</option>
                    <option value={2}>Group 2</option>
                    <option value={3}>Group 3</option>
                    <option value={4}>Group 4</option>
                </select>
            </div>

            <div className="schedule">
                <h2>Permit Group {groupId} Schedule</h2>

                {/* List users in the selected group */}
                <ul>
                    {users.map(user => (
                        <li key={user.userid}>
                            {user.first_name} {user.last_name}
                        </li>
                    ))}
                </ul>

                {/* Display the schedule for all users in the group */}
                <table className="schedule-table">
                    <thead>
                    <tr>
                        <th>Time</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({ length: 12 }).map((_, hour) => (
                        <tr key={hour}>
                            <td>{`${7 + hour}:00 AM`}</td>
                            {[...Array(7)].map((_, dayIndex) => (
                                <td key={dayIndex} className="time-slot">
                                    {scheduleBlocks
                                        .filter(block => getDayIndex(block.dow) === dayIndex &&
                                            convertTimeToHour(block.start_time) === hour + 7)
                                        .map(block => {
                                            const user = users.find(u => u.userid === block.userid);
                                            return (
                                                <div key={block.scheduleid} className="block" style={{ backgroundColor: block.block_color || '#3498db' }}>
                                                    {block.description} ({user ? `${user.first_name} ${user.last_name}` : 'Unknown'})
                                                </div>
                                            );
                                        })}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GroupSchedule;
