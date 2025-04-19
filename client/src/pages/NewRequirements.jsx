import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
  Button,
  Divider,
  Modal,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { getAllOpenRequests, updateRequestStatus } from "../apis/requirementsApi";
import { Toaster, toast } from "react-hot-toast";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 10,
  p: 3,
};

const NewRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);
  const intervalRef = useRef(null);

  const fetchRequirements = async () => {
    try {
      const data = await getAllOpenRequests();
      console.log(data);
      setRequirements(data.requests);
      setError(null);
    } catch (err) {
      console.error("Error fetching requirements:", err);
      setError("An error occurred while fetching the requirements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements(); // Initial fetch

    intervalRef.current = setInterval(fetchRequirements, 500000); // Poll every 500s

    return () => clearInterval(intervalRef.current); // Cleanup
  }, []);

  const handleVolunteer = async (requestId) => {
    try {
      const payload = {
        id: requestId,
        status: "booked",
      };
      await updateRequestStatus(payload);
      toast.success("You have volunteered successfully!");
      setSelectedReq(null);
      fetchRequirements(); // Refresh list immediately
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Toaster position="top-right" />

      <Typography variant="h5" mb={3} fontWeight="bold">
        Urgent Blood Requirements
      </Typography>

      {requirements.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No blood requirements found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {requirements.map((req, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card
                sx={{
                  p: 3,
                  borderLeft: "6px solid #22c55e",
                  cursor: "pointer",
                  minHeight: 180,
                }}
                onClick={() => setSelectedReq(req)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: "#22c55e", width: 56, height: 56 }}>
                      <LocalHospitalIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontSize="1.25rem">
                        {req.patientName}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Blood Group: <strong>{req.bloodGroup}</strong> | Units:{" "}
                        <strong>{req.unitsRequired}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Posted: {new Date(req.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Modal open={Boolean(selectedReq)} onClose={() => setSelectedReq(null)}>
        <Box sx={modalStyle}>
          {selectedReq && (
            <>
              <Typography variant="h6" fontSize="1.5rem" mb={1}>
                {selectedReq.patientName}'s Blood Request
              </Typography>
              <Typography variant="body1">
                Blood Group: {selectedReq.bloodGroup}
              </Typography>
              <Typography variant="body1">
                Units Required: {selectedReq.unitsRequired}
              </Typography>
              <Typography variant="body2" mb={2}>
                Posted: {new Date(selectedReq.createdAt).toLocaleDateString()}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="subtitle1" fontWeight="bold">
                Hospital Info:
              </Typography>
              <Typography variant="body2">
                Name: {selectedReq.hospital.hospitalName}
              </Typography>
              <Typography variant="body2">
                Email: {selectedReq.hospital.email}
              </Typography>
              <Typography variant="body2">
                Contact: {selectedReq.hospital.contact}
              </Typography>


              <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                Patient Contact:
              </Typography>
              <Typography variant="body2">
                Phone: {selectedReq.contactNumber}
              </Typography>

              <Box mt={3} textAlign="right">
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#22c55e",
                    "&:hover": { bgcolor: "#16a34a" },
                    fontWeight: "bold",
                  }}
                  onClick={() => handleVolunteer(selectedReq._id)}
                >
                  Volunteer
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default NewRequirements;
