import User from "./userModel.js";
import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  metaMaskId: {
    type: String,
    required: false,
  },
});

const Donor = User.discriminator("donor", donorSchema);
export default Donor;
