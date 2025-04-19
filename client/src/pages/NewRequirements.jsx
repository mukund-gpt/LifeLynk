//new requirements for donors
import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { getAllOpenRequests } from "../apis/requirementsApi"; 

const NewRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const getRequirements = async () => {
      try {
        console.log("Fetching blood requirements...");
        const data = await getAllOpenRequests(); 
        console.log("Fetched data:", data); 
        setRequirements(data.requests);
      } catch (error) {
        console.error("Error in fetching requirements:", error);
        setError("An error occurred while fetching the requirements.");
      } finally {
        setLoading(false); 
      }
    };

    getRequirements();
  }, []);

  if (loading) {
    console.log("Loading requirements...");
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
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
              <Card sx={{ p: 2, borderLeft: "5px solid #2563eb" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: "#2563eb" }}>
                      <LocalHospitalIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{req.hospital}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Needed By: {new Date(req.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">Patient: {req.patientName}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        Blood Group: {req.bloodGroup} | Units Required: {req.unitsRequired}
                      </Typography>
                      <Typography variant="body2">
                        Contact Number: {req.contactNumber}
                      </Typography>
                    </Box>
                  </Box>

                  <Box mt={2} textAlign="right">
                    <Button variant="outlined" color="primary" size="small">
                      Volunteer
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default NewRequirements;
