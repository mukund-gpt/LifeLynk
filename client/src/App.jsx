import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/AuthSlice";  

import HospitalProfile from "./pages/HospitalProfile";
import HospitalRequests from "./pages/HospitalRequests";
import HospitalDonors from "./pages/HospitalDonors";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contract from "./test/Contract";
import ProfileDashboard from "./pages/ProfileDashBoard";
import Navbar from "./components/navbar";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); 
  const role = user?.role;

  useEffect(() => {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser))); // Dispatch to Redux store
    }
  }, [dispatch]);

  if (user === undefined) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
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

        {/* 🔒 Public Routes (Redirect to dashboard if logged in) */}
        <Route
          path="/register"
          element={
            user ? (
              <Navigate
                to={role === "hospital" ? "/hospitalProfile" : "/dashboard/profile"}
              />
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={role === "hospital" ? "/hospitalProfile" : "/dashboard/profile"}
              />
            ) : (
              <Login />
            )
          }
        />

        {/* Test Route */}
        <Route path="/test" element={<Contract />} />

        {/* 🏥 Hospital Protected Routes */}
        {user && role === "hospital" && (
          <>
            <Route path="/hospitalProfile" element={<HospitalProfile />} />
            <Route path="/bloodRequests" element={<HospitalRequests />} />
            <Route path="/donors" element={<HospitalDonors />} />
          </>
        )}

        {/* 💉 Donor Protected Route */}
        {user && role === "donor" && (
          <Route path="/dashboard/*" element={<ProfileDashboard />} />
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
