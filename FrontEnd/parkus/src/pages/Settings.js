import React, { useEffect, useState } from 'react';
import { Button, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { hasMemberPaid, getCurrUser, getGroupId, setGroupidTobeNull, deactivateUser } from '../services/requests'; // Import necessary functions from requests
import './styles/settings.css';

function Settings() {
    const [isPaid, setIsPaid] = useState(false); // Track if the user has paid (via eTransfer, etc.)
    const [hasGroupId, setHasGroupId] = useState(false); // Track if the user has a group ID
    const [loading, setLoading] = useState(true); // Track loading state
    const [userId, setUserId] = useState(''); // Store user ID
    const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
    const [deactivationDialog, setDeactivationDialog] = useState({ open: false, message: '' }); // Track the deactivation result
    const navigate = useNavigate();

    // Fetch the user ID, payment status, and group ID when the Settings page loads
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const currentUserId = await getCurrUser();
                console.log('Current User ID:', currentUserId);
                if (currentUserId !== -1) {
                    setUserId(currentUserId);

                    // Check if the user has paid (via eTransfer)
                    const paidStatus = await hasMemberPaid(currentUserId);
                    console.log('Paid Status:', paidStatus);
                    setIsPaid(paidStatus);

                    // Check if the user has a group ID
                    const groupId = await getGroupId(currentUserId);
                    console.log('Group ID:', groupId);
                    setHasGroupId(groupId !== "None" && groupId !== null && groupId !== undefined);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
            setLoading(false); // Set loading to false after data is fetched
        };

        fetchUserInfo(); // Trigger user info fetching when the component mounts
    }, []);

    // Handle Leave Group action
    const handleLeaveGroup = async () => {
        if (isPaid) {
            console.log("User has paid, can't leave the group.");
            return;
        }

        // Use the updated setGroupidTobeNull function to set groupId to null
        const success = await setGroupidTobeNull(userId); // Set groupId to null to leave group
        if (success) {
            console.log('Successfully left the group.');
            setHasGroupId(false); // Immediately disable the button by setting group ID to false
            setOpenDialog(true); // Open the dialog after successful group leave
        } else {
            console.log('Error leaving group.');
        }
    };

    // Handle closing the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false); // Close the dialog when the user clicks OK
    };

    // Handle Deactivate Account action
    const handleDeactivateAccount = async () => {
        // First, check if the user is in a group
        const groupId = await getGroupId(userId);

        if (groupId !== "None" && groupId !== null && groupId !== undefined) {
            // Show dialog: user cannot deactivate because they are in a group
            setDeactivationDialog({
                open: true,
                message: "You cannot deactivate your account because you are in a group."
            });
            return;
        }

        // If not in a group, check if the user has paid
        if (isPaid) {
            // Show dialog: user cannot deactivate because they have paid
            setDeactivationDialog({
                open: true,
                message: "You cannot deactivate your account because you have paid for a parking permit."
            });
            return;
        }

        // If neither condition is true, proceed with deactivating the account
        const success = await deactivateUser(userId);

        if (success) {
            setDeactivationDialog({
                open: true,
                message: "Your account has been successfully deactivated."
            });
            navigate("/signin"); // Redirect to sign-in after account deactivation
        } else {
            setDeactivationDialog({
                open: true,
                message: "An error occurred while deactivating your account. Please try again."
            });
        }
    };

    const handleCloseDeactivationDialog = () => {
        setDeactivationDialog({ open: false, message: '' }); // Close the dialog
    };

    if (loading) {
        return <p>Loading...</p>; // Show a loading state while fetching user info
    }

    return (

        <div className="settings-wrapper">
            <div className="settings-container">


                {/* Success Dialog for Leaving Group */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="leave-group-dialog-title"
                    aria-describedby="leave-group-dialog-description"
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle id="leave-group-dialog-title">Group Left</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="leave-group-dialog-description">
                            You have successfully left the group.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog for Deactivation Issues */}
                <Dialog
                    open={deactivationDialog.open}
                    onClose={handleCloseDeactivationDialog}
                    aria-labelledby="deactivation-dialog-title"
                    aria-describedby="deactivation-dialog-description"
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle id="deactivation-dialog-title">Account Deactivation</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="deactivation-dialog-description">
                            {deactivationDialog.message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeactivationDialog} autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                <Stack direction="column" spacing={2}>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleLeaveGroup}
                        disabled={!hasGroupId || isPaid} // Disable the button if the user has no group ID or has paid
                        size="large" // Make the button size large
                        sx={{
                            height: '85px', // Increase the button height
                            fontSize: '18px', // Increase the font size
                            width: '400px'
                        }}
                    >
                        {!hasGroupId ? 'Not In A Group' : isPaid ? 'Cannot Leave Group (Paid)' : 'Leave Group'}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeactivateAccount}
                        size="large" // Make the button size large
                        sx={{
                            height: '85px', // Increase the button height
                            fontSize: '18px', // Increase the font size
                            width: '400px',
                        }}
                    >
                        Deactivate Account
                    </Button>
                </Stack>
            </div>
        </div>
    );

}

export default Settings;
