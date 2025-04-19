import { useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";

const EditRequestForm = ({ closeRequestFormDialog, requestData, id }) => {
    const [request, setRequest] = useState(requestData);

    const handleInputChange = (field, value) => {
        setRequest(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditRequestFormSubmit = async() => {
        try{
            const res = await axios.patch("/api/v1/requests/", {
                ...request, id
            })
            console.log("res: ", res)
        } catch(error){
            console.log("error: ", error.message)
        }
        closeRequestFormDialog();
    };

    return (
        <Dialog open={true} onClose={closeRequestFormDialog}>
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
                <TextField
                    margin="dense"
                    label="Blood Group"
                    fullWidth
                    value={request.bloodGroup}
                    onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                />
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
