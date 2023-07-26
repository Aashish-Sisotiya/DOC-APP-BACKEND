import express from "express";
import {
  RegisterUser,
  LoginUser,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorInfoController,
  bookAppointmentController,
  bookingAvailablityController,
  userAppointmentController,
  userProfileController,
} from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/authMiddleware.js";

//create router object
const router = express.Router();

//routes
router.post("/login", LoginUser);

router.post("/register", RegisterUser);

router.get("/getMyProfile",isAuthorized,userProfileController);

router.post("/getUserData", isAuthorized, authController);

router.post("/apply-doctor", isAuthorized, applyDoctorController);

router.post(
  "/get-all-notification",
  isAuthorized,
  getAllNotificationController
);

router.post(
  "/delete-all-notification",
  isAuthorized,
  deleteAllNotificationController
);

router.get("/getAllDoctors", isAuthorized, getAllDoctorInfoController);

router.post("/book-appointement", isAuthorized, bookAppointmentController);

router.post("/booking-availablity", isAuthorized, bookingAvailablityController);

router.get("/user-appoinments",isAuthorized,userAppointmentController);



export default router;
