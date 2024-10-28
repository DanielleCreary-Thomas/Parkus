// src/components/GroupSchedule/BackButton/BackButton.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (location.state && location.state.fromAvailableGroups) {
            navigate('/spotsharing', {
                state: {
                    showAvailableGroups: true,
                    availableGroups: location.state.availableGroups,
                },
            });
        } else {
            navigate('/spotsharing');
        }
    };

    return (
        <button className="back-button" onClick={handleBack}>
            Back
        </button>
    );
};

export default BackButton;
