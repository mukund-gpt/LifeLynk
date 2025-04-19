import express from "express";
import {
  signup,
  login,
  logout,
  protect,
} from "../controllers/authController.js";

import { updateMe, getDonorById } from "../controllers/donorController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.use(protect);
router.get("/", getDonorById);
router.patch("/updateUser", updateMe);

export default router;
