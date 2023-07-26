import express from "express";
import colors from "colors";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoute.js";
import cors from "cors";

dotenv.config({
  path: "./dotenv",
});

//mongodb connection
connectDB();

//rest object
const app = express();

//middleware

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
  })
);

//routes

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("server is running");
});

//listen port
app.listen(port, (req, res) => {
  console.log(
    `server running in ${process.env.DEV_MODE} Mode on port ${process.env.PORT}`
      .underline.white
  );
});
