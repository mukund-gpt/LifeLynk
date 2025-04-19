import { useState } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import LoadingPage from "../components/loading";

const EditProfileForm = ({ closeProfileEditFormDialog, details, setProfileData }) => {
    const [profile, setProfile] = useState(details);
    const [loading, setLoading] = useState(false)

    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProfileFormSubmit = async () => {
        try {
            setLoading(true)
            const res = await axios.patch("/api/v1/users/updateHospital", {
                profile
            })
            setProfileData(res.data.data.user)
            toast.success('Profile edit successfully !');
        } catch (err) {
            console.log("error: ", err.message)
            toast.success('Error in edit profile !');
        } finally{
            setLoading(false);
            closeProfileEditFormDialog()
        }
        closeProfileEditFormDialog(); // Close the form dialog
    };

    return (
        <Dialog
            open={true}
            onClose={closeProfileEditFormDialog}
            aria-labelledby="edit-profile-form-dialog-title"
        >
            {loading && <LoadingPage/>}
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
                    value={profile.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
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
