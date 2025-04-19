import React, { useState } from "react";
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
} from "@mui/icons-material";
import { registerUser } from "../apis/userApi";

const Register = () => {
  const [role, setRole] = useState("donor");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    contact: "",
    bloodGroup: "",
  });
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
      const data = await registerUser(formData, role);
      alert("Registration successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        contact: "",
        bloodGroup: "",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      alert(message);
    }
  };

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
                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
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
      </Paper>
    </Container>
  );
};

export default Register;
