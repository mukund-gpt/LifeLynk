import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import Sidebar from "../components/sidebar";
import { getContract } from "../contracts/contract";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const HospitalDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  const hospitalMongoId = user?._id;

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const contract = await getContract();
        if (!hospitalMongoId) {
          toast.error("Hospital Mongo ID not found in user data.");
          return;
        }
        const records = await contract.getDonationsReceivedByHospital(
          hospitalMongoId
        );

        const donorList = records.map((donation) => ({
          donorName: donation.donor.name,
          donorContact: donation.donor.contact,
          bloodType: donation.bloodGroup,
          unitsDonated: Number(donation.unitsDonated),
          patientName: donation.patient.name,
          patientAge: donation.patient.age,
          patientEmail: donation.patient.email,
          patientContact: donation.patient.contact,
        }));
        setDonors(donorList);
      } catch (error) {
        console.error("❌ Error fetching donor records:", error);
        toast.error("Failed to fetch donor data from the blockchain");
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="max-w-7xl mx-auto p-4">
        <Typography variant="h6" className="text-blue-600 mb-4">
          Donors and Patients List
        </Typography>

        {loading ? (
          <p>Loading donor data...</p>
        ) : donors.length === 0 ? (
          <p>No donor records found.</p>
        ) : (
          <TableContainer
            component={Paper}
            className="shadow-md overflow-x-auto"
          >
            <Table>
              <TableHead className="bg-blue-100">
                <TableRow>
                  <TableCell>Donor Name</TableCell>
                  <TableCell>Donor Contact</TableCell>
                  <TableCell>Blood Type</TableCell>
                  <TableCell>Units Donated</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Patient Age</TableCell>
                  <TableCell>Patient Email</TableCell>
                  <TableCell>Patient Contact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donors.map((donor, index) => (
                  <TableRow key={index}>
                    <TableCell>{donor.donorName}</TableCell>
                    <TableCell>{donor.donorContact}</TableCell>
                    <TableCell>{donor.bloodType}</TableCell>
                    <TableCell>{donor.unitsDonated}</TableCell>
                    <TableCell>{donor.patientName}</TableCell>
                    <TableCell>{donor.patientAge}</TableCell>
                    <TableCell>{donor.patientEmail}</TableCell>
                    <TableCell>{donor.patientContact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </>
  );
};

export default HospitalDonors;
