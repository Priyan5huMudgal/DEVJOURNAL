import mongoose from "mongoose";
import User from "./models/User.js";
let isConnected = false;
let connectionError = null;
async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (
    !mongoUri ||
    mongoUri.includes("username:password") ||
    mongoUri.trim() === ""
  ) {
    connectionError =
      "MONGO_URI is not provided or is invalid. Database connection is required for production.";
    console.error("\u274C " + connectionError);
    return;
  }
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    connectionError = null;
    return;
  }
  try {
    console.log(
      "Attempting MongoDB connection. URI starts with:",
      mongoUri.substring(0, 30),
    );
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5e3,
    });
    isConnected = true;
    connectionError = null;
    console.log("\u2705 Connected successfully to MongoDB via Mongoose!");
    try {
      const userCount = await User.countDocuments({ email: "dev@example.com" });
      if (userCount === 0) {
        console.log(
          "\u{1F331} Seeding default sandbox user (dev@example.com) into MongoDB...",
        );
        const passwordHash =
          "$2b$10$n7Jhm.y61IOyD6eOB.ZuNegHrnxtmI28PeyUeOvb6PK/XU8N3o6cO";
        await User.create({
          name: "Priyanshu Mudgal",
          username: "dev_example_user",
          email: "dev@example.com",
          passwordHash,
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
          bio: "Fullstack developer exploring compilers, distributed systems, and modern visual design languages.",
          preferences: { theme: "midnight-dark", notifications: true },
        });
      }
    } catch (seedError) {
      console.warn(
        "\u26A0\uFE0F Could not seed default user. This is usually fine (e.g. unique constraints from older schemas):",
        seedError?.message,
      );
    }
  } catch (error) {
    console.error(
      "\u274C MongoDB Connection Error Details:",
      error?.message || error,
    );
    connectionError =
      "Failed to connect to MongoDB. Please check your credentials.";
    isConnected = false;
  }
}
export { connectDB, connectionError, isConnected };
