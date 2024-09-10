import React, { useState } from 'react';
import { Button, TextField, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { supabase } from '../utils/supabase.ts';
import { Link, useNavigate } from 'react-router-dom';
import './styles/SignUp.css'; // Import your CSS for this page

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentID, setStudentID] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [licensePlateNumber, setLicensePlateNumber] = useState('');
    const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
    const navigate = useNavigate();

    const handleSignUp = async () => {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert('Error signing up: ' + error.message);
        } else {
            const { user } = data;
            const { error: insertError } = await supabase
                .from('users')
                .insert([{
                    userid: user.id,
                    first_name: firstName,
                    last_name: lastName,
                    studentid: studentID,
                    phone_number: phoneNumber,
                    email: email,
                    license_plate_number: licensePlateNumber
                }]);

            if (insertError) {
                alert('Error inserting user data: ' + insertError.message);
            } else {
                setOpenDialog(true);
            }
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
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <TextField
                    label="Student ID"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
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
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                {/* "Already have an account? Sign in" link */}
                <div className="sign-in-link">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </div>
            </div>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Registration Successful"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You have successfully registered! Please check your email to confirm your address.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SignUp;
