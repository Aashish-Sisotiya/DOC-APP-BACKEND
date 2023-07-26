import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URL}`, {
      useNewUrlParser: true,
    });
    console.log(`Mongodb Connected with ${conn.connection.host}`.brightYellow);
  } catch (error) {
    console.log(`Mongodb Server error ${error}`.bgRed.white);
  }
};

export default connectDB;
