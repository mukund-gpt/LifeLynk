import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Sidebar from "../components/sidebar";
import EditRequestForm from './EditRequestForm';
import RequestForm from "./RequestForm";
import Open from '../components/HospitalRquests/open';
import Booked from '../components/HospitalRquests/booked';
import Closed from '../components/HospitalRquests/closed';

const HospitalRequests = () => {
    const [showEditRequestForm, setShowEditRequestForm] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestFormIdx, setRequestFormIdx] = useState(-1);
    const [tabIndex, setTabIndex] = useState(0); // For tab control

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
                const res = await axios.get("/api/v1/requests/getAll");
                console.log("resBody: ", res.data.requests)
                setRequests(res.data.requests);
            } catch (err) {
                console.error("Error fetching blood requests:", err);
            }
        };

        fetchRequests();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this request?");
        if (confirmed) {
            try {
                await axios.delete("/api/v1/requests/", {
                    data: { id }
                });

                setRequests((prev) => prev.filter(req => req._id !== id));
            } catch (err) {
                console.log("error: ", err.message);
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <>
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
                openProfileEditFormDialog={() => { }}
                openRequestFormDialog={openRequestFormDialog}
                a={false}
                b={true}
            />

            <Box sx={{ width: '100%', padding: 2 }}>
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
