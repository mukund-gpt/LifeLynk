import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Box, Tabs, Tab } from "@mui/material";

import Sidebar from "../components/sidebar";
import EditRequestForm from "./EditRequestForm";
import RequestForm from "./RequestForm";
import Open from "../components/HospitalRquests/open";
import Booked from "../components/HospitalRquests/booked";
import Closed from "../components/HospitalRquests/closed";
import LoadingPage from "../components/loading";

const HospitalRequests = () => {
  const [showEditRequestForm, setShowEditRequestForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestFormIdx, setRequestFormIdx] = useState(-1);
  const [tabIndex, setTabIndex] = useState(0); // For tab control
  const [loading, setLoading] = useState(false);

  const openRequestFormDialog = () => {
    setShowRequestForm(true);
  };

  const closeRequestFormDialog = () => {
    setShowRequestForm(false);
  };

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/requests/getAll");
        console.log("res: ", res.data);
        setRequests(res.data.requests);
      } catch (err) {
        console.error("Error fetching blood requests:", err);
        toast.error("Error in fetching requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (confirmed) {
      try {
        setLoading(true);
        await axios.delete("/api/v1/requests/", {
          data: { id },
        });

        setRequests((prev) => prev.filter((req) => req._id !== id));
        toast.success("Request deleted successfully");
      } catch (err) {
        console.log("error: ", err.message);
        toast.error("Error in deleting request");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      {loading && <LoadingPage />}
      {showRequestForm && (
        <RequestForm closeRequestFormDialog={closeRequestFormDialog} />
      )}

      {showEditRequestForm && requestFormIdx !== -1 && (
        <EditRequestForm
          closeRequestFormDialog={() => setShowEditRequestForm(false)}
          requestData={requests[requestFormIdx]}
          isEdit={true}
          id={requests[requestFormIdx]._id}
        />
      )}

      <Sidebar
        openProfileEditFormDialog={() => {}}
        openRequestFormDialog={openRequestFormDialog}
        a={false}
        b={true}
      />

      <Box sx={{ width: "100%", padding: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Open" />
          <Tab label="Booked" />
          <Tab label="Closed" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tabIndex === 0 && (
            <Open
              requests={requests}
              setRequestFormIdx={setRequestFormIdx}
              setShowEditRequestForm={setShowEditRequestForm}
              handleDelete={handleDelete}
            />
          )}
          {tabIndex === 1 && (
            <Booked
              requests={requests}
              setRequestFormIdx={setRequestFormIdx}
              setShowEditRequestForm={setShowEditRequestForm}
              handleDelete={handleDelete}
            />
          )}
          {tabIndex === 2 && (
            <Closed
              requests={requests}
              setRequestFormIdx={setRequestFormIdx}
              setShowEditRequestForm={setShowEditRequestForm}
              handleDelete={handleDelete}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default HospitalRequests;
