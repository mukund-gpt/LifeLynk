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
  Box,
  Grid,
  Avatar,
  Paper,
} from "@mui/material";
import {
  LocationOn,
  Email,
  Phone,
  Badge,
  MedicalServices,
  Business,
} from "@mui/icons-material";
import LoadingPage from "../components/loading";
import { reverseGeocode } from "../apis/locationApi";

const HospitalProfile = () => {
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
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={4}>
                <Grid>
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
                  </Paper>
                </Grid>

                <Grid>
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

                <Grid>
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
    </Box>
  );
};

export default HospitalProfile;
