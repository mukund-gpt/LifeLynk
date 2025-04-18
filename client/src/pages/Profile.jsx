// DonorProfile.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { reverseGeocode } from "../apis/locationApi";
import { fetchCurrentUser } from "../apis/userApi";

const InfoSection = ({ icon, label, value }) => (
  <Paper
    elevation={3}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      px: 3,
      py: 2,
      borderRadius: 3,
      backgroundColor: "#f9fafb",
    }}
  >
    {icon}
    <Box>
      <Typography fontSize={14} color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight="medium" fontSize={16}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const DonorProfile = () => {
  const [donor, setDonor] = useState(null);
  const [address, setAddress] = useState("Fetching...");
  const [loading, setLoading] = useState(true);

  const fetchDonorData = async () => {
    try {
      const response = await fetchCurrentUser();
      const donorData = response?.data?.donor;
      setDonor(donorData);

      // Check if the location is available and fetch the address
      if (donorData?.location?.coordinates) {
        const [lng, lat] = donorData.location.coordinates;
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
      } else {
        setAddress("Location not available");
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch donor profile:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  if (!donor) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      mt={6}
      px={2}
      sx={{
        backgroundColor: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <Card
        elevation={8}
        sx={{
          maxWidth: 650,
          width: "100%",
          p: 5,
          borderRadius: 4,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={4}
          sx={{
            gap: 3, // Spacing between avatar, name, and blood group
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 120,
              height: 120,
              fontSize: 48,
            }}
          >
            {donor.name?.charAt(0)}
          </Avatar>

          <Typography variant="h5" fontWeight="bold" sx={{ fontSize: 28 }}>
            {donor.name}
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            mt={2}
            px={3}
            py={1}
            borderRadius={4}
            bgcolor="#fee2e2"
            color="#b91c1c"
            sx={{
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              fontSize: 18,
            }}
          >
            <BloodtypeIcon fontSize="large" />
            <Typography fontWeight="medium" fontSize={18}>
              {donor.bloodGroup}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Info Sections */}
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <InfoSection
                icon={<EmailIcon color="primary" />}
                label="Email"
                value={donor.email}
              />
            </Grid>

            <Grid item xs={12}>
              <InfoSection
                icon={<LocationOnIcon color="primary" />}
                label="Location"
                value={loading ? "Loading..." : address}
              />
            </Grid>

            <Grid item xs={12}>
              <InfoSection
                icon={<PeopleIcon color="primary" />}
                label="Patients Donated To"
                value={donor.patientsHelped || 0}
              />
            </Grid>

            {donor.metaMaskId && (
              <Grid item xs={12}>
                <InfoSection
                  icon={<AccountBalanceWalletIcon color="primary" />}
                  label="MetaMask ID"
                  value={donor.metaMaskId}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DonorProfile;
