import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";

const EditProfileForm = ({ closeProfileEditFormDialog, details }) => {
    const [profile, setProfile] = useState(details);

    // changing the values of form states
    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // submitting edit profile form
    const handleProfileFormSubmit = () => {
        console.log("Submitting:", profile);
        // You can send `profile` to backend here
        closeProfileEditFormDialog(); // Close the form dialog
    };

    return (
        <Dialog
            open={true}
            onClose={closeProfileEditFormDialog}
            aria-labelledby="edit-profile-form-dialog-title"
        >
            <DialogTitle id="edit-profile-form-dialog-title">Edit Profile</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="full-name"
                    label="Full Name"
                    type="text"
                    fullWidth
                    value={profile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    fullWidth
                    value={profile.contactNo}
                    onChange={(e) => handleInputChange("contactNo", e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeProfileEditFormDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleProfileFormSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileForm;
