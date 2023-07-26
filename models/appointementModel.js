import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorInfo: {
      type: String,
      require: true,
    },
    userInfo: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      default: "pending", // pending | approved | rejected
      require: true,
    },
    time: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const appointmentModel = new mongoose.model("appointments", appointmentSchema);
export default appointmentModel;
