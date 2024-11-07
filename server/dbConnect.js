import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mogouri = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(mogouri);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectDb;
