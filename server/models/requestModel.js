import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  unitsRequired: {
    type: Number,
    required: true,
  },
  age:{
    type: Number,
    required: [true, "Please input age"]
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "hospital",
    required: true,
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "donor",
    required: false,
  },
  status: {
    type: String,
    enum: ["open", "closed", "booked"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);
export default BloodRequest;
