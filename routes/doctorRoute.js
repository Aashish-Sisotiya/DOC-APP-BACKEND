import express from "express";
import {
  doctorAppointmentController,
  getDoctorByIdController,
  getDoctorInfoController,
  handleAppointmentStatus,
  updateProfileController,
} from "../controllers/doctorController.js";
import { isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/getDoctorInfo", isAuthorized, getDoctorInfoController);

router.post("/updateProfile", isAuthorized, updateProfileController);

router.post("/getDoctorById", isAuthorized, getDoctorByIdController);

router.get("/doctor-appointments", isAuthorized, doctorAppointmentController);

router.post(
  "/update-status",
  isAuthorized,
  handleAppointmentStatus
);

export default router;
