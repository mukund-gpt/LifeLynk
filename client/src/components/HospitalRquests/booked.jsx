import React, { useState } from "react";
import axios from "axios";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { updateRequestStatus } from "../../apis/requirementsApi";
import { toast } from "react-hot-toast";
import LoadingPage from "../../components/loading";

const Booked = ({ requests }) => {
    const [loading, setLoading] = useState(false);

    const handleMoveToStatus = async (id, status) => {
        try {
            setLoading(true);
            const res = await updateRequestStatus({ id, status });
            toast.success("Status changed successfully");
        } catch (error) {
            console.log('Error:', error.message);
            toast.error("Error in changing status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            {loading && <LoadingPage />}
            <Typography variant="h6" className="text-orange-600 mb-4">
                Booked Blood Requests
            </Typography>

            <TableContainer component={Paper} className="shadow-md">
                <Table>
                    <TableHead className="bg-orange-100">
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Contact</TableCell>
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
                        {requests
                            .filter(req => req.status === "booked")
                            .map((req) => (
                                <TableRow key={req._id} className="bg-orange-50 hover:bg-orange-100">
                                    <TableCell>{req?.donor?.name}</TableCell>
                                    <TableCell>{req?.donor?.email}</TableCell>
                                    <TableCell>{req?.donor?.contact}</TableCell>
                                    <TableCell>{req.patientName}</TableCell>
                                    <TableCell>{req.contactNumber}</TableCell>
                                    <TableCell>{req.age}</TableCell>
                                    <TableCell>{req.bloodGroup}</TableCell>
                                    <TableCell>{req.unitsRequired}</TableCell>
                                    <TableCell>
                                        <span className="text-orange-700 font-semibold capitalize">
                                            {req.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(req.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-4">
                                            <Tooltip title="Move to Open" arrow>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleMoveToStatus(req._id, "open")}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Move to Closed" arrow>
                                                <IconButton
                                                    color="success"
                                                    onClick={() => handleMoveToStatus(req._id, "closed")}
                                                >
                                                    <CheckIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Booked;
