import React, { useState } from "react";
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
import Navbar from "./components/navbar";

const App = () => {
  const [user, setUser] = useState(null);
  const role = user?.role;

  return (
    <Router>
      <Navbar/>
      <Routes>
        {/* Landing Route */}
        <Route
          path="/"
          element={
            user ? (
              role === "hospital" ? (
                <Navigate to="/hospitalProfile" />
              ) : role === "donor" ? (
                <Navigate to="/dashboard/profile" />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/test" element={<Contract />} />

        {/* Hospital Protected Routes */}
        {user && role === "hospital" && (
          <>
            <Route path="/hospitalProfile" element={<HospitalProfile />} />
            <Route path="/bloodRequests" element={<HospitalRequests />} />
            <Route path="/donors" element={<HospitalDonors />} />
          </>
        )}

        {/* Donor Protected Route */}
        {user && role === "donor" && (
          <Route path="/dashboard/*" element={<ProfileDashboard />} />
        )}

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
