import React, { useEffect, useState } from "react";
import EditProfileForm from "./EditHospitalProfileForm";
import Sidebar from "../components/sidebar";
import axios from "axios";
import { toast } from "react-hot-toast";
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
  Box,
  Grid,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Verified as VerifiedIcon,
  Pending as PendingIcon,
  LocationOn,
  Email,
  Phone,
  Badge,
  MedicalServices,
  Business,
  Edit,
  AssignmentInd,
} from "@mui/icons-material";
import LoadingPage from "../components/loading";
import { reverseGeocode } from "../apis/locationApi";

const HospitalProfile = () => {
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [profileData, setProfileData] = useState({});
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/users/getHospital");
        const hospital = res.data.data.hospital;
        setProfileData(hospital);

        if (
          hospital.location &&
          hospital.location.coordinates &&
          hospital.location.coordinates.length === 2
        ) {
          const [lng, lat] = hospital.location.coordinates;
          const locationName = await reverseGeocode(lat, lng);
          setAddress(locationName);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        toast.error("Error in fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const openProfileEditFormDialog = () => setShowEditProfileForm(true);
  const closeProfileEditFormDialog = () => setShowEditProfileForm(false);

  const handleLicenseFormSubmit = async () => {
    try {
      if (!licenseNumber.trim()) {
        toast.error("License number cannot be empty");
        return;
      }

      const res = await axios.put("/api/v1/users/updateLicense", {
        licenseNumber,
      });

      setProfileData(res.data.updatedHospital);
      toast.success("License number added successfully");
      setShowLicenseForm(false);
    } catch (err) {
      console.error("Error updating license:", err);
      toast.error("Failed to update license number");
    }
  };

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}
    >
      {loading && <LoadingPage />}

      <Sidebar
        openRequestFormDialog={() => {}}
        openProfileEditFormDialog={openProfileEditFormDialog}
        a={true}
        b={false}
      />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {showEditProfileForm && (
            <EditProfileForm
              closeProfileEditFormDialog={closeProfileEditFormDialog}
              details={profileData}
              setProfileData={setProfileData}
            />
          )}

          <Card
            elevation={0}
            sx={{ borderRadius: 3, border: "1px solid #e0e0e0", mb: 4 }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 3,
                      bgcolor: "primary.main",
                      fontSize: "2rem",
                    }}
                  >
                    {profileData.hospitalName?.charAt(0) || "H"}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {profileData.hospitalName || "Hospital Name"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      {profileData.licenseNumber ? (
                        <Chip
                          icon={<VerifiedIcon />}
                          label="Verified"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      ) : (
                        <Chip
                          icon={<PendingIcon />}
                          label="Pending Verification"
                          color="warning"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      )}
                      <Tooltip title="Edit Profile">
                        <IconButton
                          size="small"
                          onClick={openProfileEditFormDialog}
                          sx={{ ml: 1 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>

                {!profileData.licenseNumber && (
                  <Button
                    variant="contained"
                    startIcon={<AssignmentInd />}
                    onClick={() => setShowLicenseForm(true)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                    }}
                  >
                    Submit License
                  </Button>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                    >
                      Hospital Information
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Business color="action" sx={{ mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Hospital Type:</strong>{" "}
                        {profileData.hospitalType || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <MedicalServices color="action" sx={{ mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Specializations:</strong>{" "}
                        {profileData.specializations?.join(", ") || "General"}
                      </Typography>
                    </Box>

                    {profileData.licenseNumber && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <VerifiedIcon color="action" sx={{ mr: 2 }} />
                        <Typography variant="body1">
                          <strong>License No:</strong>{" "}
                          {profileData.licenseNumber}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                    >
                      Contact Details
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Badge color="action" sx={{ mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Admin:</strong> {profileData.name || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Email color="action" sx={{ mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Email:</strong> {profileData.email || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Phone color="action" sx={{ mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Phone:</strong> {profileData.contact || "N/A"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                    >
                      Location
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <LocationOn color="action" sx={{ mr: 2, mt: 0.5 }} />
                      <Typography variant="body1">
                        {address || "Location information loading..."}
                      </Typography>
                    </Box>

                    {profileData.location?.coordinates && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Coordinates:{" "}
                          {profileData.location.coordinates.join(", ")}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* License Number Dialog */}
      <Dialog
        open={showLicenseForm}
        onClose={() => setShowLicenseForm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "common.white",
            fontWeight: 600,
            py: 2,
            px: 3,
          }}
        >
          Hospital License Verification
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please enter your hospital's official license number for
            verification. This information will be reviewed by our
            administration team.
          </Typography>

          <TextField
            autoFocus
            label="License Number"
            fullWidth
            variant="outlined"
            margin="normal"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Example: MH-12345-2023 or similar format as per your region
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setShowLicenseForm(false)}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLicenseFormSubmit}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            Submit for Verification
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HospitalProfile;
