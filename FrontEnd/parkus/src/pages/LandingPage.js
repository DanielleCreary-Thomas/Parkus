import { Button, CssBaseline } from "@mui/material";
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate(); // Hook to navigate between routes

    const handleSignInClick = () => {
        navigate('/signin'); // Navigate to the sign-in page
    };

    const handleSignUpClick = () => {
        navigate('/signup'); // Navigate to the sign-up page (if you have one)
    };

    return (
        <div className="landing-page">
            <CssBaseline />
            <div className="content">
                <h1>Welcome to Parkus</h1>
                <p>Your convenient parking management solution.</p>
                <div className="button-group">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className="sign-in-btn"
                        onClick={handleSignInClick} // Call handleSignInClick when clicked
                    >
                        Sign In
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        className="sign-up-btn"
                        onClick={handleSignUpClick} // Call handleSignUpClick when clicked
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </div>
    );
}
