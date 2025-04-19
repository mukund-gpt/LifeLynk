import React from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Closed = ({ requests, setRequestFormIdx, setShowEditRequestForm, handleDelete }) => {
    return (
        <div className="max-w-5xl mx-auto p-4">
            <Typography variant="h6" className="text-red-600 mb-4">
                Closed Blood Requests
            </Typography>

            <TableContainer component={Paper} className="shadow-md">
                <Table>
                    <TableHead className="bg-red-100">
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
                        {requests
                            .filter(req => req.status === "closed")
                            .map((req) => (
                                <TableRow key={req._id} className="bg-red-50 hover:bg-red-100">
                                    <TableCell>{req.patientName}</TableCell>
                                    <TableCell>{req.contactNumber}</TableCell>
                                    <TableCell>{req.age}</TableCell>
                                    <TableCell>{req.bloodGroup}</TableCell>
                                    <TableCell>{req.unitsRequired}</TableCell>
                                    <TableCell>
                                        <span className="text-red-700 font-semibold capitalize">
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
                                                const actualIndex = requests.findIndex(r => r._id === req._id);
                                                setRequestFormIdx(actualIndex);
                                                setShowEditRequestForm(true);
                                            }}
                                            disabled={req.status !== "open"}
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
    );
};

export default Closed;
