// server/server.js
const express = require("express");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.route");
const { globalLimiter } = require("./middlewares/rateLimiter.middleware");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
// apply global limiter to all routes
app.use(globalLimiter);

// routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
