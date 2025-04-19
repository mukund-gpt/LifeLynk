import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HospitalProfile from "./pages/HospitalProfile";
import HospitalRequests from "./pages/hospitalRequests";
import HospitalDonors from "./pages/HospitalDonors";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contract from "./test/Contract";
import ProfileDashboard from "./pages/ProfileDashBoard";

const App = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  // if (user) console.log(user);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<div className="text-red-100">Hello world</div>}
        />
        <Route path="/bloodRequests" element={<HospitalRequests />} />
        <Route path="/donors" element={<HospitalDonors />} />
        <Route path="/hospitalProfile" element={<HospitalProfile />} />
        <Route path="/bloodRequests" element={<HospitalRequests />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard/*" element={<ProfileDashboard />} />

        <Route path="/test" element={<Contract />} />
      </Routes>
    </Router>
  );
};

export default App;
