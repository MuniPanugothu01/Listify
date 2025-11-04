// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();

// const connectDB = async () => { 

//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/craigdb");
//     console.log("✅ MongoDB connected successfully");
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = { connectDB };


require("dotenv").config();
const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined in environment variables");
      process.exit(1);
    }

    console.log("🔗 Attempting MongoDB connection...");
    console.log(
      `📍 Connection string: ${process.env.MONGO_URI.replace(
        /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
        "mongodb+srv://***:***@"
      )}`
    );

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🎯 Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("💡 Troubleshooting tips:");
    console.log("   1. Check if MongoDB is running");
    console.log("   2. Verify MONGO_URI in .env file");
    console.log("   3. Check network connectivity");
    console.log("   4. Verify database credentials");
    process.exit(1);
  }
};

// Enhanced connection event handlers
mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose disconnected from MongoDB");
});

// Handle application termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB connection closed through app termination");
  process.exit(0);
});

module.exports = { connectDB };
