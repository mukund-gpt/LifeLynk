//profile dashboard for donor
import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";

import DonorProfile from "./Profile";
import EditProfile from "./EditProfile";
import NewRequirements from "./NewRequirements";
import Donated from "./Donated";

const ProfileDashboard = () => {
  const location = useLocation();

  const menu = [
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Edit Profile", path: "/dashboard/edit" },
    { label: "New Requirements", path: "/dashboard/requirements" },
    { label: "Donated", path: "/dashboard/donated" },
  ];

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          background: "#0f172a",
          color: "#fff",
          py: 4,
          px: 2,
          borderRight: "1px solid #1e293b",
        }}
      >
        <Typography variant="h6" mb={3} fontWeight="bold" textAlign="center">
          Donor Dashboard
        </Typography>

        <List>
          {menu.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                mb: 1,
                borderRadius: 2,
                color: "#fff",
                "&.Mui-selected": {
                  backgroundColor: "#2563eb",
                },
                "&:hover": {
                  backgroundColor: "#1e40af",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={4} sx={{ bgcolor: "#f9fafb", overflow: "auto" }}>
        <Routes>
          {/* Default route to profile */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/profile" replace />} />
          
          {/* Routes for profile pages */}
          <Route path="/profile" element={<DonorProfile />} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/requirements" element={<NewRequirements />} />
          <Route path="/donated" element={<Donated />} />

          {/* Fallback route */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ProfileDashboard;
