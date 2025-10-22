const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const TokenBlacklist = require("../models/TokenBlacklist");
const UserSession = require("../models/UserSession");
const { generateTokens } = require("../utils/generateTokens");
const logger = require("../utils/logger");
const {
  registerValidation,
  loginValidation,
} = require("../validations/user.validation");

const {
  incrFailedAttempt,
  resetFailedAttempts,
  lockAccountRedis,
} = require("../middlewares/rateLimiter.middleware");

// ---------- Register ----------
const registerUser = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      await logger.warn("Registration validation failed", req, null, {
        validationError: error.details[0].message,
        body: req.body,
      });
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await logger.warn("Registration attempt with existing email", req, null, {
        email,
        reason: "User already exists",
      });
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Create session on registration
    await UserSession.create({
      user: user._id,
      token: accessToken,
      device: req.body.device || req.headers["user-agent"] || "unknown",
      ip: req.ip,
    });

    await logger.audit("USER_REGISTRATION", req, user, "SUCCESS", {
      sessionCreated: true,
    });

    await logger.info("User registered successfully", req, user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    await logger.error("Error registering user", req, null, {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- Login ----------
const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      await logger.warn("Login validation failed", req, null, {
        validationError: error.details[0].message,
        email: req.body.email,
      });
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      await logger.warn("Login attempt with non-existent email", req, null, {
        email,
        reason: "User not found",
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check if account locked in DB (fallback)
    if (user.isLocked) {
      await logger.warn("Login attempt to locked account", req, user, {
        reason: "Account locked",
        lockStatus: user.isLocked,
      });
      return res
        .status(423)
        .json({ message: "Account locked. Contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // increment Redis fail counter
      const { count } = await incrFailedAttempt({
        userId: user._id.toString(),
        windowSec: 15 * 60,
      });
      const FAIL_LIMIT = Number(process.env.FAIL_LIMIT || 5);

      // store persisted counters (optional)
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      user.lastLoginAttempt = new Date();
      await user.save();

      await logger.warn("Failed login attempt", req, user, {
        attemptCount: count,
        failLimit: FAIL_LIMIT,
        remainingAttempts: FAIL_LIMIT - count,
      });

      if (count >= FAIL_LIMIT) {
        await lockAccountRedis(user._id.toString(), 15 * 60); // lock 15 minutes
        user.isLocked = true;
        await user.save();

        await logger.audit("ACCOUNT_LOCKED", req, user, "LOCKED", {
          reason: "Too many failed attempts",
          lockDuration: "15 minutes",
        });

        return res.status(423).json({
          message: "Account locked due to multiple failed attempts. Try later.",
        });
      }

      return res.status(400).json({ message: "Invalid credentials" });
    }

    // success: reset failed attempts, clear DB counters
    await resetFailedAttempts(user._id.toString());
    user.loginAttempts = 0;
    user.isLocked = false;
    await user.save();

    // generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // session/device management
    const sessions = await UserSession.find({ user: user._id });
    const MAX_SESSIONS = Number(process.env.MAX_SESSIONS || 3);
    if (sessions.length >= MAX_SESSIONS) {
      await logger.warn("Maximum sessions exceeded", req, user, {
        currentSessions: sessions.length,
        maxSessions: MAX_SESSIONS,
      });

      return res.status(403).json({
        message: `Maximum ${MAX_SESSIONS} devices allowed. Logout from another device.`,
      });
    }

    await UserSession.create({
      user: user._id,
      token: accessToken,
      device: req.body.device || req.headers["user-agent"] || "unknown",
      ip: req.ip,
    });

    // set refresh cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await logger.audit("USER_LOGIN", req, user, "SUCCESS", {
      sessionCreated: true,
      deviceCount: sessions.length + 1,
    });

    await logger.info("User logged in successfully", req, user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    await logger.error("Error logging in user", req, null, {
      error: error.message,
      stack: error.stack,
      email: req.body.email,
    });
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- Logout ----------
const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await logger.warn("Logout attempt without valid token", req, req.user);
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]?.trim();
    if (!token) {
      await logger.warn("Logout attempt with malformed token", req, req.user);
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.decode(token);
    const expiry = decoded
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000);

    await TokenBlacklist.create({ token, expiresAt: expiry });

    // remove session by token
    const session = await UserSession.findOneAndDelete({ token });

    await logger.audit("USER_LOGOUT", req, req.user, "SUCCESS", {
      tokenBlacklisted: true,
      sessionRemoved: !!session,
    });

    await logger.info("User logged out successfully", req, req.user);

    // clear refresh cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    await logger.error("Error logging out user", req, req.user, {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- Refresh ----------
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      await logger.warn("Token refresh attempt without refresh token", req);
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      await logger.warn("Token refresh for non-existent user", req, null, {
        userId: decoded.id,
      });
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    await logger.audit("TOKEN_REFRESH", req, user, "SUCCESS");

    return res.status(200).json({ accessToken });
  } catch (error) {
    await logger.error("Refresh token error", req, null, {
      error: error.message,
      tokenType: "refresh",
    });
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// ---------- Profile ----------
const getProfile = async (req, res) => {
  try {
    await logger.audit("PROFILE_ACCESS", req, req.user, "SUCCESS");
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    await logger.error("Error fetching profile", req, req.user, {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getProfile,
};
