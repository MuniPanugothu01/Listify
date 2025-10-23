// // server/routes/user.route.js
// const express = require("express");
// const { protect } = require("../middlewares/auth.middleware");
// const {
//   registerUser,
//   loginUser,
//   logoutUser,
//   refreshToken,
//   getProfile,
// } = require("../controllers/user.controller");

// const {
//   loginLimiterIP,
//   globalLimiter,
// } = require("../middlewares/rateLimiter.middleware");
// const checkAccountLock = require("../middlewares/accountLock.middleware");

// const router = express.Router();

// /**
//  * ✅ Apply rate limiting & account lock logic properly:
//  * - Global limiter → all routes (prevents abuse)
//  * - loginLimiterIP → only for login
//  * - checkAccountLock → prevents locked users from retrying login
//  */

// // Apply global rate limiter to all user routes
// router.use(globalLimiter);

// /**
//  * @route   POST /api/users/register
//  * @desc    Register a new user
//  */
// router.post("/register", registerUser);

// /**
//  * @route   POST /api/users/login
//  * @desc    Authenticate user and issue tokens
//  * @limit   5 attempts / 5 min per IP
//  */
// router.post("/login", loginLimiterIP, checkAccountLock, loginUser);

// /**
//  * @route   POST /api/users/logout
//  * @desc    Logout and blacklist access token
//  * @access  Private
//  */
// router.post("/logout", protect, logoutUser);

// /**
//  * @route   GET /api/users/profile
//  * @desc    Get authenticated user's profile
//  * @access  Private
//  */
// router.get("/profile", protect, getProfile);

// /**
//  * @route   POST /api/users/refresh-token
//  * @desc    Refresh access token using valid refresh token
//  */
// router.post("/refresh-token", refreshToken);

// module.exports = router;

const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getProfile,
} = require("../controllers/user.controller");
const {
  listSessions,
  revokeSession,
} = require("../controllers/sessions.controller");
const { protect } = require("../middlewares/auth.middleware");
const {
  loginLimiterIP,
  globalLimiter,
  registerLimiterIP,
} = require("../middlewares/rateLimiter.middleware");
const checkAccountLock = require("../middlewares/accountLock.middleware");
const { requestLogger } = require("../utils/logger");
const { geoLocationMiddleware } = require("../middlewares/geoLocation");

const router = express.Router();

// Apply global rate limiter to all routes
router.use(globalLimiter);

// Apply request logger and geo location to all routes
router.use(requestLogger);
router.use(geoLocationMiddleware);

// Public routes
router.post("/register", registerLimiterIP, registerUser);
router.post("/login", loginLimiterIP, checkAccountLock, loginUser);
router.post("/refresh-token", refreshToken);

// Protected routes (all routes below require authentication)
router.use(protect);

router.post("/logout", logoutUser);
router.get("/profile", getProfile);
router.get("/sessions", listSessions);
router.delete("/sessions/:id", revokeSession);

module.exports = router;
