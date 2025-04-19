import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HospitalProfile from "./pages/HospitalProfile";
import HospitalRequests from "./pages/hospitalRequests";
import HospitalDonors from "./pages/HospitalDonors";

const App = () => {
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
      </Routes>
    </Router>
  );
};


export default App;
