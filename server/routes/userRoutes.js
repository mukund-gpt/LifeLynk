import express from "express";
import {
  signup,
  login,
  logout,
  protect,
} from "../controllers/authController.js";

import { updateMe, getDonorById } from "../controllers/donorController.js";
import { getHospitalById } from "../controllers/hospitalController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.use(protect);
router.get("/", getDonorById);
router.patch("/updateUser", updateMe);
router.get("/getHospital", getHospitalById);

export default router;
