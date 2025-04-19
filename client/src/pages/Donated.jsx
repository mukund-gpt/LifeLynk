//to whom the donors donated
import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
} from "@mui/material";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";

const sampleDonations = [
  {
    name: "Aarav Mehta",
    date: "2024-12-10",
    location: "AIIMS Delhi",
    bloodGroup: "O+",
  },
  {
    name: "Simran Kaur",
    date: "2025-02-04",
    location: "Fortis Mumbai",
    bloodGroup: "B+",
  },
  {
    name: "Rohan Verma",
    date: "2025-03-15",
    location: "Apollo Chennai",
    bloodGroup: "A-",
  },
];

const Donated = () => {
  return (
    <Box>
      <Typography variant="h5" mb={3} fontWeight="bold">
        Donation History
      </Typography>
      <Grid container spacing={3}>
        {sampleDonations.map((donation, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card sx={{ p: 2, borderLeft: "5px solid #ef4444" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: "#ef4444" }}>
                    <BloodtypeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{donation.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Donated on {donation.date}
                    </Typography>
                    <Typography variant="body2">{donation.location}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      Blood Group: {donation.bloodGroup}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Donated;
