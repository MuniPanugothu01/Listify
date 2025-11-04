const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getProfile,
} = require("../controllers/user.controller");
const {
  protect,
  allowExpiredForLogout,
} = require("../middlewares/auth.middleware");
const {
  loginLimiterIP,
  globalLimiter,
  registerLimiterIP,
} = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

// Apply global rate limiter to all routes
router.use(globalLimiter);

// Public routes
router.post("/register", registerLimiterIP, registerUser);
router.post("/login", loginLimiterIP, loginUser);
router.post("/refresh-token", refreshToken);

// Protected routes
router.post("/logout", allowExpiredForLogout, logoutUser);
router.get("/profile", protect, getProfile);

module.exports = router;