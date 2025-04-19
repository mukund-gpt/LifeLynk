import { useState } from "react";
import {toast} from "react-hot-toast"
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import LoadingPage from "../components/loading";

const EditRequestForm = ({ closeRequestFormDialog, requestData, id }) => {
    const [request, setRequest] = useState(requestData);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setRequest(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditRequestFormSubmit = async () => {
        try {
            setLoading(true);
            const res = await axios.patch("/api/v1/requests/", {
                ...request,
                id
            });
            setLoading(false);
            toast.success("Request edit successfully")
        } catch (error) {
            console.log("error: ", error.message);
            setLoading(false);
            toast.error("Error in edit request")
        } finally {
            closeRequestFormDialog();
        }
    };

    return (
        <Dialog open={true} onClose={closeRequestFormDialog}>
            {loading && <LoadingPage />}
            <DialogTitle>Edit Request</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Patient Name"
                    fullWidth
                    value={request.patientName}
                    onChange={(e) => handleInputChange("patientName", e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Contact Number"
                    fullWidth
                    value={request.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Age"
                    fullWidth
                    value={request.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Blood Group</InputLabel>
                    <Select
                        value={request.bloodGroup}
                        label="Blood Group"
                        onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                    >
                        <MenuItem value="A+">A+</MenuItem>
                        <MenuItem value="A-">A-</MenuItem>
                        <MenuItem value="B+">B+</MenuItem>
                        <MenuItem value="B-">B-</MenuItem>
                        <MenuItem value="AB+">AB+</MenuItem>
                        <MenuItem value="AB-">AB-</MenuItem>
                        <MenuItem value="O+">O+</MenuItem>
                        <MenuItem value="O-">O-</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    label="Units Required"
                    fullWidth
                    value={request.unitsRequired}
                    onChange={(e) => handleInputChange("unitsRequired", e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeRequestFormDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleEditRequestFormSubmit} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditRequestForm;
