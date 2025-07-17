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
      if (!donorMongoId) {
        toast.error("Donor Mongo ID not found in user data.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const contract = await getContract();

        // Call contract method
        const recordsProxy = await contract.getDonationsByDonor(donorMongoId);
        console.log("Raw contract response:", recordsProxy);

        // Convert Proxy/ethers objects to plain JS array
        // If it’s iterable, spread it; otherwise try converting manually
        let records = [];
        if (
          recordsProxy &&
          typeof recordsProxy[Symbol.iterator] === "function"
        ) {
          records = [...recordsProxy];
        } else if (Array.isArray(recordsProxy)) {
          records = recordsProxy;
        } else {
          // Possibly an object - try to parse its values
          records = Object.values(recordsProxy);
        }

        // Normalize each record: convert BigNumbers and nested structures if needed
        const normalized = records.map((donation) => {
          // Defensive checks for nested fields
          const patient = donation.patient || {};
          const hospital = donation.hospital || {};

          return {
            ...donation,
            timestamp: donation.timestamp ? Number(donation.timestamp) : 0,
            unitsDonated: donation.unitsDonated
              ? Number(donation.unitsDonated)
              : 0,
            patient: {
              name: patient.name || "Unknown",
              age: patient.age || "N/A",
              email: patient.email || "N/A",
              contact: patient.contact || "N/A",
            },
            hospital: {
              name: hospital.name || "Unknown",
              location: hospital.location || "Unknown",
            },
            bloodGroup: donation.bloodGroup || "Unknown",
          };
        });

        setDonations(normalized);
      } catch (error) {
        console.error("❌ Error fetching donation history:", error);
        toast.error("Failed to fetch your donation history");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [donorMongoId]);

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
            <Grid key={idx}>
              <Card
                sx={{
                  p: 2,
                  borderLeft: "5px solid #ef4444",
                  width: 360,
                  height: 250,
                }}
              >
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
                        {donation.timestamp
                          ? new Date(donation.timestamp * 1000).toLocaleString()
                          : "Unknown"}
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
                        {donation.unitsDonated}
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
