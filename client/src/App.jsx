import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HospitalProfile from "./pages/HospitalProfile";
import HospitalRequests from "./pages/HospitalRequests";
import HospitalDonors from "./pages/HospitalDonors";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contract from "./test/Contract";
import ProfileDashboard from "./pages/ProfileDashBoard";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user")); // get user from localStorage
  console.log(user);

  const role = user?.role; // 'user' or 'hospital'

  return (
    <Router>
      <Routes>
      <Route
          path="/"
          element={
            user.role === "hospital" ? (
              <Navigate to="/hospitalProfile" />
            ) : user.role === "donor" ? (
              <Navigate to="/dashboard/profile" />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Contract />} />

        {/* Routes for hospital only */}
        {role === "hospital" && (
          <>
            <Route path="/bloodRequests" element={<HospitalRequests />} />
            <Route path="/donors" element={<HospitalDonors />} />
            <Route path="/hospitalProfile" element={<HospitalProfile />} />
          </>
        )}

        {/* Routes for user (donor) only */}
        {role === "donor" && (
          <Route path="/dashboard/*" element={<ProfileDashboard />} />
        )}

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
