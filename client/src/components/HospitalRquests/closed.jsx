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
} from "@mui/material";

const Closed = ({ requests }) => {
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
            </TableRow>
          </TableHead>
          <TableBody>
            {requests
              .filter((req) => req.status === "closed")
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Closed;
