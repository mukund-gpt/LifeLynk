import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import DonorProfile from "./Profile";
import EditProfile from "./EditProfile";
import NewRequirements from "./NewRequirements";
import Donated from "./Donated";
import { logoutUser } from "../apis/userApi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/AuthSlice";

const ProfileDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const menu = [
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Edit Profile", path: "/dashboard/edit" },
    { label: "New Requirements", path: "/dashboard/requirements" },
    { label: "Donated", path: "/dashboard/donated" },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(setUser(null));
      navigate("/login");
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  // If no user, navigate to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
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

        {/* Logout Button */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={4} sx={{ bgcolor: "#f9fafb", overflow: "auto" }}>
        <Routes>
          <Route path="/" element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<DonorProfile />} />
          <Route path="edit" element={<EditProfile />} />
          <Route path="requirements" element={<NewRequirements />} />
          <Route path="donated" element={<Donated />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ProfileDashboard;
