
import mongoose from "mongoose";

let connectionPromise;

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
};
