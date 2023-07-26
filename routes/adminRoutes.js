import express from "express";
import { isAuthorized } from "../middlewares/authMiddleware.js";
import { admin } from "./../middlewares/authAdminMiddleware.js";
import {
  changeAccountStatusController,
  getAllDoctorController,
  getAllUserController,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/getAllUsers", isAuthorized, admin, getAllUserController);

router.get("/getAllDoctors", isAuthorized, admin, getAllDoctorController);

router.post(
  "/changeAccountStatus",
  isAuthorized,
  changeAccountStatusController
);

export default router;
