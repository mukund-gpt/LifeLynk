import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
} from "@mui/material";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import { getContract } from "../contracts/contract";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Donated = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const donorMongoId = user?._id;

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const contract = await getContract();
        if (!donorMongoId) {
          toast.error("Donor Mongo ID not found in user data.");
          return;
        }
        const records = await contract.getDonationsByDonor(donorMongoId);
        setDonations(records);
      } catch (error) {
        console.error("❌ Error fetching donation history:", error);
        toast.error("Failed to fetch your donation history");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <Box>
      <Typography variant="h5" mb={3} fontWeight="bold">
        Donation History
      </Typography>

      {loading ? (
        <Typography>Loading donations...</Typography>
      ) : donations.length === 0 ? (
        <Typography>No donation records found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {donations.map((donation, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card sx={{ p: 2, borderLeft: "5px solid #ef4444" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: "#ef4444" }}>
                      <BloodtypeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {donation.patient.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Donated on{" "}
                        {new Date(
                          Number(donation.timestamp) * 1000
                        ).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Age: {donation.patient.age}
                      </Typography>
                      <Typography variant="body2">
                        Email: {donation.patient.email}
                      </Typography>
                      <Typography variant="body2">
                        Contact: {donation.patient.contact}
                      </Typography>
                      <Typography variant="body2" mt={1}>
                        📍 Hospital: {donation.hospital.name} -{" "}
                        {donation.hospital.location}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        🩸 Blood Group: {donation.bloodGroup} | 💉 Units:{" "}
                        {Number(donation.unitsDonated)}
                      </Typography>
                    </Box>
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

export default Donated;
