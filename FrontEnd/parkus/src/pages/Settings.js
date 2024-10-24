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
    const [confirmLeaveGroup, setConfirmLeaveGroup] = useState(false); // Track confirmation for leaving group
    const [confirmDeactivateAccount, setConfirmDeactivateAccount] = useState(false); // Track confirmation for deactivating account
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

    // Handle Leave Group action after confirmation
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
        setConfirmLeaveGroup(false); // Close the confirmation dialog
    };

    // Handle Deactivate Account action after confirmation
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
        setConfirmDeactivateAccount(false); // Close the confirmation dialog
    };

    // Handle opening confirmation dialogs
    const handleConfirmLeaveGroup = () => {
        setConfirmLeaveGroup(true); // Show confirmation dialog for leaving group
    };

    const handleConfirmDeactivateAccount = () => {
        setConfirmDeactivateAccount(true); // Show confirmation dialog for deactivating account
    };

    // Handle closing the confirmation dialogs
    const handleCloseLeaveGroupConfirmation = () => {
        setConfirmLeaveGroup(false);
    };

    const handleCloseDeactivateAccountConfirmation = () => {
        setConfirmDeactivateAccount(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); // Close the dialog when the user clicks OK
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

                {/* Confirmation Dialog for Leaving Group */}
                <Dialog
                    open={confirmLeaveGroup}
                    onClose={handleCloseLeaveGroupConfirmation}
                    aria-labelledby="confirm-leave-group-title"
                    aria-describedby="confirm-leave-group-description"
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle id="confirm-leave-group-title">Leave Group</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="confirm-leave-group-description">
                            Are you sure you want to leave the group?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseLeaveGroupConfirmation} color="primary">No</Button>
                        <Button onClick={handleLeaveGroup} color="secondary" autoFocus>Yes</Button>
                    </DialogActions>
                </Dialog>

                {/* Confirmation Dialog for Deactivating Account */}
                <Dialog
                    open={confirmDeactivateAccount}
                    onClose={handleCloseDeactivateAccountConfirmation}
                    aria-labelledby="confirm-deactivate-account-title"
                    aria-describedby="confirm-deactivate-account-description"
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle id="confirm-deactivate-account-title">Deactivate Account</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="confirm-deactivate-account-description">
                            Are you sure you want to deactivate your account?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeactivateAccountConfirmation} color="primary">No</Button>
                        <Button onClick={handleDeactivateAccount} color="secondary" autoFocus>Yes</Button>
                    </DialogActions>
                </Dialog>

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
                        onClick={handleConfirmLeaveGroup} // Trigger confirmation dialog
                        disabled={!hasGroupId || isPaid} // Disable the button if the user has no group ID or has paid
                        size="large" // Make the button size large
                        sx={{
                            height: '85px', // Increase the button height
                            fontSize: '18px', // Increase the font size
                            width: '400px'
                        }}
                    >
                        {!hasGroupId ? 'Leave Group (Not In A Group)' : isPaid ? 'Cannot Leave Group (Paid)' : 'Leave Group'}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmDeactivateAccount} // Trigger confirmation dialog
                        disabled={hasGroupId || isPaid} // Disable the button if the user is in a group or has paid
                        size="large" // Make the button size large
                        sx={{
                            height: '85px', // Increase the button height
                            fontSize: '18px', // Increase the font size
                            width: '400px',
                            backgroundColor: (hasGroupId || isPaid) ? 'grey' : undefined, // Grey out if disabled
                            color: (hasGroupId || isPaid) ? 'white' : undefined, // Ensure text is visible
                        }}
                    >
                        {hasGroupId ? 'Cannot Deactivate (In Group)' : isPaid ? 'Cannot Deactivate (Paid)' : 'Deactivate Account'}
                    </Button>
                </Stack>

            </div>
        </div>
    );
}

export default Settings;
