import React from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography
} from "@mui/material";
import Sidebar from "../components/sidebar";

const HospitalDonors = () => {
    const donors = [
        {
            name: "Vikram Mehta",
            contactNo: "+91 9988776655",
            age: "42",
            bloodType: "O+",
            unitsDonated: "4",
        },
        {
            name: "Sneha Kapoor",
            contactNo: "+91 9876543210",
            age: "29",
            bloodType: "A-",
            unitsDonated: "2",
        },
        {
            name: "Ramesh Iyer",
            contactNo: "+91 9123456780",
            age: "35",
            bloodType: "B+",
            unitsDonated: "1",
        },
        {
            name: "Neha Sinha",
            contactNo: "+91 9988123456",
            age: "26",
            bloodType: "AB+",
            unitsDonated: "3",
        },
    ];

    return (
        <>
            <Sidebar />
            <div className="max-w-5xl mx-auto p-4">
                <Typography variant="h6" className="text-blue-600 mb-4">
                    Donors List
                </Typography>

                <TableContainer component={Paper} className="shadow-md">
                    <Table>
                        <TableHead className="bg-blue-100">
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Contact No</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell>Blood Type</TableCell>
                                <TableCell>Units Donated</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {donors.map((donor, index) => (
                                <TableRow key={index}>
                                    <TableCell>{donor.name}</TableCell>
                                    <TableCell>{donor.contactNo}</TableCell>
                                    <TableCell>{donor.age}</TableCell>
                                    <TableCell>{donor.bloodType}</TableCell>
                                    <TableCell>{donor.unitsDonated}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default HospitalDonors;
