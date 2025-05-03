import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Tabs,
  Tab,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Container,
  Paper,
} from "@mui/material";
import {
  Email,
  Lock,
  Person,
  LocalPhone,
  Bloodtype,
  Visibility,
  VisibilityOff,
  LocalHospital,
} from "@mui/icons-material";
import { registerUser } from "../apis/userApi";
import { reverseGeocode } from "../apis/locationApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("donor");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    contact: "",
    bloodGroup: "",
    hospitalName: "",
  });
  const [location, setLocation] = useState(null); // GeoJSON
  const [address, setAddress] = useState(""); // Only for display
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (event, newValue) => {
    setRole(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        ...(role === "donor" ? {} : { hospitalName: formData.hospitalName }),
        ...(location && { location }),
      };

      await registerUser(dataToSend, role);

      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        contact: "",
        bloodGroup: "",
        hospitalName: "",
      });

      setLocation(null);
      setAddress("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({
          type: "Point",
          coordinates: [longitude, latitude],
        });
        const addr = await reverseGeocode(latitude, longitude);
        setAddress(addr);
      },
      (err) => {
        console.error("Location access denied:", err);
        setAddress("Location access denied");
      }
    );
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
        <Tabs
          value={role}
          onChange={handleRoleChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Donor" value="donor" />
          <Tab label="Hospital" value="hospital" />
        </Tabs>

        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 600 }}>
          {role === "donor" ? "Donor Registration" : "Hospital Registration"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              size="large"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            {role === "hospital" && (
              <TextField
                fullWidth
                label="Hospital Name"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                required
                size="large"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalHospital />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              size="large"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              size="large"
              inputProps={{ minLength: 8 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="passwordConfirm"
              type={showPassword ? "text" : "password"}
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              size="large"
              error={
                formData.passwordConfirm &&
                formData.passwordConfirm !== formData.password
              }
              helperText={
                formData.passwordConfirm &&
                formData.passwordConfirm !== formData.password
                  ? "Passwords do not match"
                  : ""
              }
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              size="large"
              placeholder="+91XXXXXXXXXX"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalPhone />
                  </InputAdornment>
                ),
              }}
            />
            {role === "donor" && (
              <TextField
                fullWidth
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
                size="large"
                placeholder="e.g., O+, A-"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Bloodtype />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {address && (
              <Typography variant="body2" color="textSecondary">
                📍 Current Location: {address}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                mt: 2,
                borderRadius: 2,
              }}
            >
              Register as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          </Box>
        </form>

        <Button
          variant="text"
          fullWidth
          className="!mt-4 !text-blue-600"
          onClick={() => navigate("/login")}
        >
          Have an account? Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Register;
