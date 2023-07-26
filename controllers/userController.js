import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import doctorModel from "./../models/doctorModel.js";
import appointmentModel from "../models/appointementModel.js";
import moment from "moment";

//login callback
export const LoginUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return res.status(200).send({
        success: false,
        message: `User not found`,
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        success: false,
        message: `Invalid Email or Password`,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      success: true,
      message: `Successfully logged in`,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Login Controller ${error.message}`,
    });
  }
};

//register callback
export const RegisterUser = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: `User already Exist`,
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    const newUser = new UserModel(req.body);
    await newUser.save();

    res.status(201).send({
      success: true,
      message: `Registered Successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

export const authController = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

export const userProfileController = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Profile not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Fetched Profile data",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in userProfile controller",
      error,
    });
  }
};

export const applyDoctorController = async (req, res) => {
  try {
    req.body.timings.from = moment(
      req.body.timings.from,
      "HH:mm"
    ).toISOString();
    req.body.timings.to = moment(req.body.timings.to, "HH:mm").toISOString();
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await UserModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await UserModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while Applying For Doctor",
    });
  }
};

export const getAllNotificationController = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;

    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "Marked all notifiction as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in geting notification",
      error,
    });
  }
};

export const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    user.seenNotification = [];
    user.notification = [];

    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "Deleted all seen notification succesfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notification",
      error,
    });
  }
};

export const getAllDoctorInfoController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    if (!doctors) {
      return res.status(200).send({
        success: true,
        message: "There is no approved doctor",
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Fetched ${doctors.length} approved Doctors`,
        data: doctors,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to get all doctors",
      error,
    });
  }
};

export const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    //find the user who want to book appointment
    //find the doctor with which the user want to book appointment
    const doctor = await UserModel.findOne({ _id: req.body.doctorInfo.userId });

    doctor.notification.push({
      type: "appointment-request",
      message: `${req.body.userInfo?.name}   want to book an appointment`,
      onClickPath: "/user/appointments",
    });
    await doctor.save();
    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while booking appointment",
      error,
    });
  }
};

export const bookingAvailablityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hour")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hour").toISOString();

    const appointments = await appointmentModel.find({
      doctorId: req.body.doctorId, // Assuming you have a 'doctorId' field in the request body
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      // If there are existing appointments in the specified time range
      return res.status(200).send({
        success: false,
        message: "Appointment not available at this time",
      });
    } else {
      // If no existing appointments in the specified time range
      res.status(200).send({
        success: true,
        message: "Appointment available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while checking availability",
      error: error.message, // Sending only the error message to the client
    });
  }
};

export const userAppointmentController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    if (!appointments) {
      return res.status(200).send({
        success: true,
        message: "You don't have any appointment",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Fetched Your appointments",
        data: appointments,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error  in userAppointmentController",
      error,
    });
  }
};
