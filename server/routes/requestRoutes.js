import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createRequestAndSendEmail,
  deleteRequest,
  getAllOpenRequests,
  getAllRequestsForHospital,
  restrictTo,
  updateRequest,
  updateRequestStatus,
  
} from "../controllers/requestController.js";

// import userController from "./../controllers/userController.js";

const router = express.Router();

router.use(protect);
router.get("/", getAllOpenRequests);
router.patch("/status", updateRequestStatus);

//restricted for hospital
router.patch("/", updateRequest);
router.use(restrictTo("hospital"));
router.get("/getAll", getAllRequestsForHospital);
router.post("/", createRequestAndSendEmail);
router.get("/getAllOpenRequest", getAllOpenRequests);
router.delete("/", deleteRequest);
export default router;
