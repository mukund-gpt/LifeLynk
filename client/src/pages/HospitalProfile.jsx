import React, { useEffect, useState } from "react";
import EditProfileForm from "./EditHospitalProfileForm";
import Sidebar from "../components/sidebar";
import axios from "axios";

// Material UI components
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const HospitalProfile = () => {
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [profileData, setProfileData] = useState({});
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/v1/users/getHospital");
        setProfileData(res.data.data.hospital);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfile();
  }, []);

  const openProfileEditFormDialog = () => {
    setShowEditProfileForm(true);
  };

  const closeProfileEditFormDialog = () => {
    setShowEditProfileForm(false);
  };

  const handleLicenseFormSubmit = () => {
    console.log("License Number:", licenseNumber);
    // Add your form submission logic here (e.g., send to server)
    setShowLicenseForm(false); // Close the form after submission
  };

  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      {showEditProfileForm && (
        <EditProfileForm
          closeProfileEditFormDialog={closeProfileEditFormDialog}
          details={profileData}
          setProfileData={setProfileData}
        />
      )}
      <Sidebar
        openRequestFormDialog={() => {}}
        openProfileEditFormDialog={openProfileEditFormDialog}
        a={true}
        b={false}
      />

      {/* Profile Card */}
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardContent>
          <Typography variant="h5" className="font-semibold text-blue-700">
            {profileData.hospitalName}
          </Typography>
          <Divider className="my-2" />
          <Typography>Email: {profileData.email}</Typography>
          <Typography>Contact No: {profileData.contact}</Typography>

          <Typography>
            Verification Status:{" "}
            {profileData.licenseNumber === "" ? (
              <span className="font-semibold text-yellow-500">Pending</span>
            ) : (
              <span className="font-semibold text-green-600">
                {profileData.licenseNumber}
              </span>
            )}
          </Typography>

          {profileData.verificationStatus === "Pending" && (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowLicenseForm(true)}
                className="mt-2"
              >
                Add License Details
              </Button>
              <Dialog
                open={showLicenseForm}
                onClose={() => setShowLicenseForm(false)}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  Add License Number
                </DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="license-number"
                    label="License Number"
                    type="text"
                    fullWidth
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setShowLicenseForm(false)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleLicenseFormSubmit} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalProfile;
