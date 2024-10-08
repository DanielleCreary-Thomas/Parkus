import React, { useState } from 'react';
import { Button, TextField, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { supabase } from '../utils/supabase.ts';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/SignUp.css';
import { addUserData } from '../services/requests.js';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentID, setStudentID] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [licensePlateNumber, setLicensePlateNumber] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            // Sign up user using Supabase Auth
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        studentid: studentID,
                        phone_number: phoneNumber,
                        license_plate_number: licensePlateNumber,
                    },
                },
            });

            if (signUpError) {
                console.error('Sign-up error:', signUpError);
                if (signUpError.message.includes("already registered")) {
                    toast.error("Email already exists. Please use a different email.");
                } else {
                    toast.error(signUpError.message);
                }
                return;
            }

            // Send the user data and car data to the backend to insert into 'users' and 'cars' tables
            const userData = {
                user_id: signUpData.user.id,  // Use the user ID from the authentication
                first_name: firstName,
                last_name: lastName,
                email: signUpData.user.email,
                studentid: studentID,
                phone_number: phoneNumber,
                license_plate_number: licensePlateNumber
            };

            await addUserData(userData);  // Insert user and car data via backend

            setOpenDialog(true);  // Show success dialog

        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('An unexpected error occurred. Please try again.');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        navigate('/signin');
    };

    return (
        <div className="sign-up-page">
            <CssBaseline />
            <div className="sign-up-card">
                <h1>Sign Up for Parkus</h1>

                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <TextField
                    label="Student ID"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    required
                />
                <TextField
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <TextField
                    label="License Plate Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={licensePlateNumber}
                    onChange={(e) => setLicensePlateNumber(e.target.value)}
                    required
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSignUp}
                    className="sign-up-button"
                >
                    Sign Up
                </Button>

                <div className="sign-in-link">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </div>
            </div>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        backgroundColor: '#f5f5f5',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
                        borderRadius: '12px',
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        color: '#333',
                        fontSize: '24px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}
                    id="alert-dialog-title"
                >
                    {"Registration Successful"}
                </DialogTitle>
                <DialogContent
                    sx={{
                        padding: '16px 24px',
                    }}
                >
                    <DialogContentText
                        sx={{
                            color: '#666',
                            textAlign: 'center',
                            fontSize: '18px',
                        }}
                        id="alert-dialog-description"
                    >
                        You have successfully registered!
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        sx={{
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#155a9b',
                            },
                            borderRadius: '8px',
                            padding: '6px 16px',
                        }}
                        onClick={handleCloseDialog}
                        autoFocus
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
        </div>
    );
};

export default SignUp;