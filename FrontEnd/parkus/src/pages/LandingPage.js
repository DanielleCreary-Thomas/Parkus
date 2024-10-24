import { useState, useRef } from 'react';
import { Button, CssBaseline, AppBar, Toolbar, Typography, Box, Container, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import './styles/landing.css';

export default function LandingPage() {
    const navigate = useNavigate(); // Hook to navigate between routes
    const [selectedCard, setSelectedCard] = useState('scheduling'); // Default selection
    const cardSectionRef = useRef(null); // Ref for the card section

    const handleSignInClick = () => {
        navigate('/signin'); // Navigate to the sign-in page
    };

    const handleSignUpClick = () => {
        navigate('/signup'); // Navigate to the sign-up page (if you have one)
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    const handleExploreClick = () => {
        // Scroll to the card section smoothly
        if (cardSectionRef.current) {
            cardSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <CssBaseline />

            {/* Floating Top Navigation Bar */}
            <AppBar
                position="absolute"
                sx={{
                    backgroundColor: '#fff',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                    padding: '10px 40px',
                    margin: '20px',
                    borderRadius: '10px',
                    left: 0,
                    right: 0,
                    maxWidth: 'calc(100% - 40px)',
                    top: '20px',
                    justifyContent: 'center',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
                    <img src={`${process.env.PUBLIC_URL}/1.jpg`} alt="illustration" style={{ width: '50px' }} />
                    </Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            sx={{ marginRight: '10px', borderColor: '#000', color: '#000' }}
                            onClick={handleSignInClick}
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#6200ea', color: '#fff' }} // Adjusted to a clearer background color
                            onClick={handleSignUpClick}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>


            {/* First section */}
            <Box sx={{ backgroundColor: '#84B5D3', minHeight: '100vh', paddingTop: '200px', paddingBottom: '100px', display: 'flex', alignItems: 'center' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2D3748', marginBottom: '20px' }}>
                                Seamless Parking Solutions for{" "}
                                <span className="dynamic-text">
                                    <span className="word-one">Everyone.</span>
                                    <span className="word-two">Convenience.</span>
                                    <span className="word-three">Ease.</span>
                                </span>
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#666', marginBottom: '20px' }}>
                                Beautifully designed templates using React.js, ant design, and styled-components! Save weeks of time and build your landing page in minutes.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <Button variant="contained" sx={{ backgroundColor: '#1A202C', color: '#fff', padding: '10px 20px' }} onClick={handleExploreClick}>
                                    Explore
                                </Button>
                                <Button variant="contained" sx={{ backgroundColor: '#f56b6b', color: '#fff', padding: '10px 20px' }}>
                                    Learn more
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <img src={`${process.env.PUBLIC_URL}/1.jpg`} alt="illustration" style={{ width: '100%' }} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Existing content follows */}
            <Box ref={cardSectionRef} sx={{ backgroundColor: '#F0F0F0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' }}>
                {/* Cards that trigger content display */}
                <Container maxWidth="md" sx={{ textAlign: 'center', marginBottom: '30px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: '20px', marginBottom: '30px' }}>
                        <Card
                            onClick={() => handleCardClick('scheduling')}
                            sx={{
                                padding: '20px',
                                width: '250px',
                                height: '150px',
                                borderRadius: '10px',
                                boxShadow: 'none',
                                transition: '0.3s',
                                cursor: 'pointer',
                                backgroundColor: selectedCard === 'scheduling' ? '#f0f4ff' : '#fff',
                                border: selectedCard === 'scheduling' ? '2px solid #3f51b5' : '1px solid #eee',
                                transform: selectedCard === 'scheduling' ? 'rotate(-2deg)' : 'none', // Tilting effect
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>scheduling</Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                scheduling
                            </Typography>
                        </Card>
                        <Card
                            onClick={() => handleCardClick('spotsharing')}
                            sx={{
                                padding: '20px',
                                width: '250px',
                                height: '150px',
                                borderRadius: '10px',
                                boxShadow: 'none',
                                transition: '0.3s',
                                cursor: 'pointer',
                                backgroundColor: selectedCard === 'spotsharing' ? '#f9ebff' : '#fff',
                                border: selectedCard === 'spotsharing' ? '2px solid #9c27b0' : '1px solid #eee',
                                transform: selectedCard === 'spotsharing' ? 'rotate(2deg)' : 'none', // Tilting effect
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Spot Sharing</Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                Spot Sharing
                            </Typography>
                        </Card>
                        <Card
                            onClick={() => handleCardClick('matchmaking')}
                            sx={{
                                padding: '20px',
                                width: '250px',
                                height: '150px',
                                borderRadius: '10px',
                                boxShadow: 'none',
                                transition: '0.3s',
                                cursor: 'pointer',
                                backgroundColor: selectedCard === 'matchmaking' ? '#e3f2fd' : '#fff',
                                border: selectedCard === 'matchmaking' ? '2px solid #0288d1' : '1px solid #eee',
                                transform: selectedCard === 'matchmaking' ? 'rotate(-1deg)' : 'none', // Tilting effect
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>matchmaking</Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                matchmaking
                            </Typography>
                        </Card>
                    </Box>
                </Container>

                {/* Content based on selected card */}
                <Container maxWidth="md" sx={{ width: '800px', height: '550px', marginBottom: '30px' }}>
                    {selectedCard === 'scheduling' && (
                        <Card sx={{ borderRadius: '12px', width: '100%', height: '100%', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)' }}>
                            <CardContent>
                                <Typography variant="h4" sx={{ marginBottom: '20px', color: '#333' }}>
                                <img src={`${process.env.PUBLIC_URL}/2.png`} alt="illustration" style={{ width: '100%' }} />
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    {selectedCard === 'spotsharing' && (
                        <Card sx={{ borderRadius: '12px', width: '100%', height: '100%', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)' }}>
                            <CardContent>
                                <Typography variant="h4" sx={{ marginBottom: '20px', color: '#333' }}>
                                    Screenshot
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    {selectedCard === 'matchmaking' && (
                        <Card sx={{ borderRadius: '12px', width: '100%', height: '100%', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)' }}>
                            <CardContent>
                                <Typography variant="h4" sx={{ marginBottom: '20px', color: '#333' }}>
                                    Screenshot
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Container>
            </Box>
        </>
    );
}
