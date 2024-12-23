import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL!;

// if (MONGODB_URI.length === 0) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
