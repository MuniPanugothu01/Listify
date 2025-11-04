const express = require("express");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
const responseTime = require("response-time");
const userRoutes = require("./routes/user.route");
const { globalLimiter } = require("./middlewares/rateLimiter.middleware");
const { requestLogger } = require("./utils/logger");
const sessionRoutes = require("./routes/sessions.route");
// Load environment variables
dotenv.config();

const app = express();

// ==================== SECURITY & PERFORMANCE MIDDLEWARES ====================

// Set security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // disable if APIs don’t serve HTML
    crossOriginEmbedderPolicy: false,
  })
);

// Enable gzip compression for all responses
app.use(compression());

// Track response time
app.use(responseTime());

// Trust proxy (important for rate limiting & correct client IPs behind load balancers)
app.set("trust proxy", 1);

// CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Parse JSON and URL-encoded payloads
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Cookie parser
app.use(cookieParser());

// Global rate limiter
app.use(globalLimiter);

// Request logging (custom + morgan for production)
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}
app.use(requestLogger);

// ==================== ROUTES ====================
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);

// ==================== HEALTH CHECKS ====================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "auth-service",
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
  });
});

// ==================== ERROR HANDLING ====================
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    path: req.path,
    method: req.method,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("🔥 Global Error:", error);

  const isProduction = process.env.NODE_ENV === "production";

  res.status(error.status || 500).json({
    success: false,
    message: isProduction ? "Internal server error" : error.message,
    timestamp: new Date().toISOString(),
  });
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 3002;

// Connect DB & Start Server
connectDB()
  .then(() => {
    console.log("✅ Database connected successfully.");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 Health: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("✅ Process terminated cleanly.");
      });
    });

    process.on("unhandledRejection", (err) => {
      console.error("🚨 Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });
