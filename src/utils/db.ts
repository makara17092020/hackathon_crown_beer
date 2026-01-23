import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

// Prevent multiple connections in dev
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Adding the "!" tells TypeScript MONGODB_URI is definitely a string here
    cached.promise = mongoose
      .connect(MONGODB_URI!)
      .then((mongoose) => {
        console.log("MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
