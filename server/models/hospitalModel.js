import User from "./userModel.js";
import mongoose from "mongoose";
import donor from "../models/donorModel.js"

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
  }
});

const Hospital = User.discriminator("hospital", hospitalSchema);
export default Hospital;
