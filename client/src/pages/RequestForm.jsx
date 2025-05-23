import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import LoadingPage from "../components/loading";

const RequestForm = ({ closeRequestFormDialog }) => {
  const [request, setRequest] = useState({
    patientName: "",
    age: "",
    bloodGroup: "",
    unitsRequired: "",
    contactNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setRequest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRequestFormSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/v1/requests/", {
        request,
      });
      toast.success("Request created successfully");
    } catch (err) {
      console.log("error: ", err.message);
      toast.error("Error in creating request");
    } finally {
      setLoading(false);
      closeRequestFormDialog();
    }
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <Dialog
      open={true}
      onClose={closeRequestFormDialog}
      aria-labelledby="request-form-dialog-title"
    >
      {loading && <LoadingPage />}
      <DialogTitle id="request-form-dialog-title">
        Blood Request Form
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="patient-name"
          label="Patient Name"
          type="text"
          fullWidth
          value={request.patientName}
          onChange={(e) => handleInputChange("patientName", e.target.value)}
        />
        <TextField
          margin="dense"
          id="age"
          label="Age"
          type="number"
          fullWidth
          value={request.age}
          onChange={(e) => handleInputChange("age", e.target.value)}
        />
        <TextField
          select
          margin="dense"
          id="blood-type"
          label="Blood Type"
          fullWidth
          value={request.bloodGroup}
          onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
        >
          {bloodTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          id="units-required"
          label="Units Required"
          type="number"
          fullWidth
          value={request.unitsRequired}
          onChange={(e) => handleInputChange("unitsRequired", e.target.value)}
        />
        <TextField
          margin="dense"
          id="contact-no"
          label="Contact Number"
          type="tel"
          fullWidth
          value={request.contactNumber}
          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeRequestFormDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleRequestFormSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestForm;
