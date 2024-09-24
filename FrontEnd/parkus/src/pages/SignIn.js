import React, { useState } from 'react';
import { supabase } from '../utils/supabase.ts';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, CssBaseline, Typography } from "@mui/material";
import './styles/SignIn.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            alert('Error signing in: ' + error.message);
        } else {
            navigate('/home'); // Redirect to home page after successful sign-in
        }
    };

    const handleSignUpRedirect = () => {
        navigate('/signup'); // Redirect to the sign-up page
    };

    return (
        <div className="sign-in-page">
            <CssBaseline />
            <div className="sign-in-content">
                <h1>Sign In</h1>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    InputLabelProps={{ shrink: true }} // Keep label outside of input field
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    InputLabelProps={{ shrink: true }} // Keep label outside of input field
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSignIn}
                    className="sign-in-button"
                >
                    Sign In
                </Button>

                {/* Add the "Sign Up" option */}
                <Typography variant="body2" className="sign-up-prompt">
                    Don't have an account?{' '}
                    <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={handleSignUpRedirect}
                    >
                        Sign Up
                    </Button>
                </Typography>
            </div>
        </div>
    );
};

export default SignIn;
