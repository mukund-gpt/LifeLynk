import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createRequest,
  getAllOpenRequests,
  getAllRequestsForHospital,
  restrictTo,
  sendEmailToDonors,
} from "../controllers/requestController.js";

// import userController from "./../controllers/userController.js";

const router = express.Router();

router.use(protect);
router.get("/", getAllOpenRequests);
router.use(restrictTo("hospital"));
router.post("/", sendEmailToDonors, createRequest);
router.get("/", getAllRequestsForHospital);
router.get("/getAllOpenRequest", getAllOpenRequests);
export default router;
