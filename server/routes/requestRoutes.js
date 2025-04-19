import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createRequest,
  deleteRequest,
  getAllOpenRequests,
  getAllRequestsForHospital,
  restrictTo,
  sendEmailToDonors,
  updateRequest,
  updateRequestStatus,
} from "../controllers/requestController.js";

// import userController from "./../controllers/userController.js";

const router = express.Router();

router.use(protect);
router.get("/", getAllOpenRequests);
router.patch("/status", updateRequestStatus);

//restricted for hospital
router.use(restrictTo("hospital"));
router.post("/", sendEmailToDonors, createRequest);
router.get("/getAll", getAllRequestsForHospital);
router.patch("/", updateRequest);
router.delete("/", deleteRequest);
export default router;
