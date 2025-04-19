import React, { useState, useEffect } from 'react';
import axios from "axios"
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Sidebar from "../components/sidebar"
import EditRequestForm from './EditRequestForm';
import RequestForm from "./RequestForm";

const HospitalRequests = () => {
    const [showEditRequestForm, setShowEditRequestForm] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestFormIdx, setRequestFormIdx] = useState(-1);

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
                const res = await axios.get("/api/v1/requests/");
                setRequests(res.data.requests);
            } catch (err) {
                console.error("Error fetching blood requests:", err);
            }
        };

        fetchRequests();
    }, [])

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this request?");
        if (confirmed) {
            try {
                await axios.delete("/api/v1/requests/", {
                    data: { id }
                });

                // Update the state to remove the deleted request
                setRequests((prev) => prev.filter(req => req._id !== id));
            } catch (err) {
                console.log("error: ", err.message);
            }
        }
    };


    return (
        <>
            {showRequestForm && (
                <RequestForm
                    closeRequestFormDialog={closeRequestFormDialog}
                />
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
                openProfileEditFormDialog={() => { }}
                openRequestFormDialog={openRequestFormDialog}
                a={false}
                b={true}
            />

            <div className="max-w-5xl mx-auto p-4">
                <Typography variant="h6" className="text-blue-600 mb-4">
                    Blood Requests
                </Typography>

                <TableContainer component={Paper} className="shadow-md">
                    <Table>
                        <TableHead className="bg-blue-100">
                            <TableRow>
                                <TableCell>Patient Name</TableCell>
                                <TableCell>Contact No</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell>Blood Type</TableCell>
                                <TableCell>Units</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Requested At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((req, index) => (
                                <TableRow key={req._id}>
                                    <TableCell>{req.patientName}</TableCell>
                                    <TableCell>{req.contactNumber}</TableCell>
                                    <TableCell>{req.age}</TableCell>
                                    <TableCell>{req.bloodGroup}</TableCell>
                                    <TableCell>{req.unitsRequired}</TableCell>
                                    <TableCell>
                                        <span className={`font-medium ${req.status === "Open" ? "text-green-600" : "text-yellow-600"}`}>
                                            {req.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(req.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => {
                                                setRequestFormIdx(index);
                                                setShowEditRequestForm(true);
                                            }}
                                            disabled={req.status === "Closed"}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(req._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default HospitalRequests;
