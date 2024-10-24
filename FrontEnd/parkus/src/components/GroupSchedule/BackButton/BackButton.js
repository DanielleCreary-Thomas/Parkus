// src/components/GroupSchedule/BackButton/BackButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <button className="back-button" onClick={handleBack}>
            Back
        </button>
    );
};

export default BackButton;
