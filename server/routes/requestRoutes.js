import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createRequestAndSendEmail,
  getAllRequestsForHospital,
  restrictTo,
  getAllOpenRequests,
} from "../controllers/requestController.js";

// import userController from "./../controllers/userController.js";

const router = express.Router();

router.use(protect);
router.get("/", getAllOpenRequests);
router.use(restrictTo("hospital"));
router.post("/", createRequestAndSendEmail);
router.get("/", getAllRequestsForHospital);
export default router;
