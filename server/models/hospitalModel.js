import User from "./userModel.js";
import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  metaMaskId: {
    type: String,
    required: false,
  },
});

const Hospital = User.discriminator("hospital", hospitalSchema);
export default Hospital;
