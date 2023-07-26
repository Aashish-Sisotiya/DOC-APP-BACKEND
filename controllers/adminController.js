import doctorModel from "../models/doctorModel.js";
import UserModel from "../models/userModel.js";

export const getAllUserController = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send({
      success: true,
      message: "users data",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching users",
    });
  }
};

export const getAllDoctorController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "doctors data",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching doctors",
    });
  }
};

export const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await UserModel.findOne({ _id: doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "Doctor account request updated",
      message: `Your Doctor Account request has been ${status}`,
      clickPath: "/notification",
    });
    user.isDoctor = status === "approved" ? true : false;

    await user.save();

    res.status(201).send({
      success: true,
      message: "Account status updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while changing account status",
      error,
    });
  }
};
