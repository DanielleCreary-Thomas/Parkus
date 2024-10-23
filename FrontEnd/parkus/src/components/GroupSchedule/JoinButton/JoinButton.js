// src/components/GroupSchedule/JoinButton/JoinButton.js

import React from 'react';
import { supabase } from '../../../utils/supabase.ts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './JoinButton.css';

const JoinButton = ({ groupId }) => {
    const navigate = useNavigate();

    const handleJoinGroup = async () => {
        // Get the current user ID
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
            toast.error('You need to log in to join a group.');
            return;
        }

        const userId = session.user.id;

        // Send a request to the backend to join the group
        try {
            const response = await fetch('http://127.0.0.1:5000/join-group', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    group_id: groupId,
                    user_id: userId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to join group.');
                return;
            }

            // Successfully joined the group
            toast.success('Successfully joined the group.');
            // Optionally, navigate to another page or update the UI
            navigate('/home');
        } catch (error) {
            console.error('Error joining group:', error);
            toast.error('An error occurred while joining the group.');
        }
    };

    return (
        <button className="join-button" onClick={handleJoinGroup}>
            Join Group
        </button>
    );
};

export default JoinButton;
