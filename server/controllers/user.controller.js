const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const TokenBlacklist = require("../models/TokenBlacklist");
const UserSession = require("../models/UserSession");
const { generateTokens } = require("../utils/generateTokens");
const { logger, auditLog, userInfoLog } = require("../utils/logger");
const {
  registerValidation,
  loginValidation,
} = require("../validations/user.validation");
const {
  incrFailedAttempt,
  resetFailedAttempts,
  lockAccountRedis,
} = require("../middlewares/rateLimiter.middleware");

// Register function with enhanced logging
const registerUser = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      await userInfoLog("warn", "Registration validation failed", req, null, {
        validationError: error.details[0].message,
        attemptedEmail: req.body.email,
        activityType: "REGISTRATION_ATTEMPT",
        status: "VALIDATION_FAILED",
      });
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await userInfoLog(
        "warn",
        "Registration attempt with existing email",
        req,
        null,
        {
          email,
          activityType: "REGISTRATION_ATTEMPT",
          status: "DUPLICATE_EMAIL",
          reason: "User already exists in database",
        }
      );
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Create user session with enhanced device info
    await UserSession.create({
      user: user._id,
      token: accessToken,
      device: req.geoLocation.deviceName,
      browser: req.geoLocation.browser,
      platform: req.geoLocation.platform,
      ip: req.geoLocation.ip,
      location: req.geoLocation.location,
      userAgent: req.geoLocation.userAgent,
      loginTime: new Date(),
    });

    await auditLog("USER_REGISTRATION", req, user, "SUCCESS", {
      activityType: "REGISTRATION",
      status: "SUCCESS",
      sessionCreated: true,
      registrationMethod: "email",
      securityLevel: "NORMAL",
    });

    await userInfoLog("info", "User registered successfully", req, user, {
      activityType: "REGISTRATION",
      status: "SUCCESS",
      deviceInfo: {
        type: req.geoLocation.deviceType,
        name: req.geoLocation.deviceName,
        browser: req.geoLocation.browser,
        platform: req.geoLocation.platform,
      },
      locationInfo: {
        location: req.geoLocation.location,
        country: req.geoLocation.country,
        city: req.geoLocation.city,
        isInternal: req.geoLocation.isInternal,
      },
      registrationTime: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error("Error registering user", {
      error: error.message,
      stack: error.stack,
      attemptedEmail: req.body.email,
      ip: req.ip,
      location: req.clientLocation,
      userAgent: req.headers["user-agent"],
      requestId: req.requestId,
      activityType: "REGISTRATION_ERROR",
      status: "ERROR",
    });
    res.status(500).json({ message: "Server error" });
  }
};

// Fixed login function - FIXED BCRYPT COMPARE ISSUE
const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      await userInfoLog("warn", "Login validation failed", req, null, {
        validationError: error.details[0].message,
        attemptedEmail: req.body.email,
        activityType: "LOGIN_ATTEMPT",
        status: "VALIDATION_FAILED",
      });
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // FIX: Select password field explicitly since it's excluded by default
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      await userInfoLog(
        "warn",
        "Login attempt with non-existent email",
        req,
        null,
        {
          attemptedEmail: email,
          activityType: "LOGIN_ATTEMPT",
          status: "USER_NOT_FOUND",
          reason: "User not found in database",
        }
      );
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isLocked) {
      await userInfoLog("warn", "Login attempt to locked account", req, user, {
        activityType: "LOGIN_ATTEMPT",
        status: "ACCOUNT_LOCKED",
        reason: "Account is temporarily locked",
        lockStatus: user.isLocked,
        loginAttempts: user.loginAttempts,
      });
      return res
        .status(423)
        .json({ message: "Account locked. Contact support." });
    }

    // FIX: Check if password exists before comparing
    if (!user.password) {
      await userInfoLog(
        "error",
        "User password not found in database",
        req,
        user,
        {
          activityType: "LOGIN_ATTEMPT",
          status: "PASSWORD_MISSING",
          reason: "User password field is empty or null",
        }
      );
      return res
        .status(500)
        .json({ message: "System error. Please contact support." });
    }

    // FIX: Proper bcrypt compare with error handling
    let isMatch;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      await userInfoLog("error", "Password comparison error", req, user, {
        activityType: "LOGIN_ATTEMPT",
        status: "BCRYPT_ERROR",
        error: bcryptError.message,
        reason: "Error during password verification",
      });
      return res
        .status(500)
        .json({ message: "System error. Please try again." });
    }

    if (!isMatch) {
      const { count } = await incrFailedAttempt({
        userId: user._id.toString(),
        windowSec: 15 * 60,
      });
      const FAIL_LIMIT = Number(process.env.FAIL_LIMIT || 5);

      user.loginAttempts = (user.loginAttempts || 0) + 1;
      user.lastLoginAttempt = new Date();
      await user.save();

      await userInfoLog("warn", "Failed login attempt", req, user, {
        activityType: "LOGIN_ATTEMPT",
        status: "FAILED",
        attemptCount: count,
        failLimit: FAIL_LIMIT,
        remainingAttempts: FAIL_LIMIT - count,
        totalLoginAttempts: user.loginAttempts,
        securityLevel: "HIGH_RISK",
      });

      if (count >= FAIL_LIMIT) {
        await lockAccountRedis(user._id.toString(), 15 * 60);
        user.isLocked = true;
        await user.save();

        await auditLog("ACCOUNT_LOCKED", req, user, "LOCKED", {
          reason: "Too many failed attempts",
          lockDuration: "15 minutes",
          totalFailedAttempts: user.loginAttempts,
          securityEvent: "AUTO_LOCK",
        });

        return res.status(423).json({
          message: "Account locked due to multiple failed attempts. Try later.",
        });
      }

      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successful login
    await resetFailedAttempts(user._id.toString());
    user.loginAttempts = 0;
    user.isLocked = false;
    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);

    const sessions = await UserSession.find({ user: user._id });
    const MAX_SESSIONS = Number(process.env.MAX_SESSIONS || 3);

    if (sessions.length >= MAX_SESSIONS) {
      await userInfoLog("warn", "Maximum sessions exceeded", req, user, {
        activityType: "SESSION_LIMIT",
        status: "LIMIT_EXCEEDED",
        currentSessions: sessions.length,
        maxSessions: MAX_SESSIONS,
        securityLevel: "MEDIUM_RISK",
      });

      return res.status(403).json({
        message: `Maximum ${MAX_SESSIONS} devices allowed. Logout from another device.`,
      });
    }

    // Create new session with enhanced device info
    await UserSession.create({
      user: user._id,
      token: accessToken,
      device: req.geoLocation.deviceName,
      browser: req.geoLocation.browser,
      platform: req.geoLocation.platform,
      ip: req.geoLocation.ip,
      location: req.geoLocation.location,
      userAgent: req.geoLocation.userAgent,
      loginTime: new Date(),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await auditLog("USER_LOGIN", req, user, "SUCCESS", {
      activityType: "LOGIN",
      status: "SUCCESS",
      sessionCreated: true,
      deviceCount: sessions.length + 1,
      loginMethod: "email",
      securityLevel: "NORMAL",
    });

    await userInfoLog("info", "User logged in successfully", req, user, {
      activityType: "LOGIN",
      status: "SUCCESS",
      sessionCount: sessions.length + 1,
      loginTime: new Date().toISOString(),
      deviceInfo: {
        type: req.geoLocation.deviceType,
        name: req.geoLocation.deviceName,
        browser: req.geoLocation.browser,
        platform: req.geoLocation.platform,
      },
      locationInfo: {
        location: req.geoLocation.location,
        country: req.geoLocation.country,
        city: req.geoLocation.city,
        isInternal: req.geoLocation.isInternal,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    logger.error("Error logging in user", {
      error: error.message,
      stack: error.stack,
      attemptedEmail: req.body.email,
      ip: req.ip,
      location: req.clientLocation,
      userAgent: req.headers["user-agent"],
      requestId: req.requestId,
      activityType: "LOGIN_ERROR",
      status: "ERROR",
    });
    res.status(500).json({ message: "Server error" });
  }
};

// Enhanced logout function
const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await userInfoLog(
        "warn",
        "Logout attempt without valid token",
        req,
        req.user,
        {
          activityType: "LOGOUT_ATTEMPT",
          status: "INVALID_TOKEN",
        }
      );
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]?.trim();
    if (!token) {
      await userInfoLog(
        "warn",
        "Logout attempt with malformed token",
        req,
        req.user,
        {
          activityType: "LOGOUT_ATTEMPT",
          status: "MALFORMED_TOKEN",
        }
      );
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.decode(token);
    const expiry = decoded
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000);

    await TokenBlacklist.create({ token, expiresAt: expiry });

    const session = await UserSession.findOneAndDelete({ token });

    await auditLog("USER_LOGOUT", req, req.user, "SUCCESS", {
      activityType: "LOGOUT",
      status: "SUCCESS",
      tokenBlacklisted: true,
      sessionRemoved: !!session,
      logoutTime: new Date().toISOString(),
      securityLevel: "NORMAL",
    });

    await userInfoLog("info", "User logged out successfully", req, req.user, {
      activityType: "LOGOUT",
      status: "SUCCESS",
      deviceInfo: {
        type: req.geoLocation.deviceType,
        name: req.geoLocation.deviceName,
        browser: req.geoLocation.browser,
        platform: req.geoLocation.platform,
      },
      locationInfo: {
        location: req.geoLocation.location,
        country: req.geoLocation.country,
        city: req.geoLocation.city,
        isInternal: req.geoLocation.isInternal,
      },
      logoutTime: new Date().toISOString(),
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    logger.error("Error logging out user", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id?.toString(),
      username: req.user?.name,
      email: req.user?.email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      requestId: req.requestId,
      activityType: "LOGOUT_ERROR",
      status: "ERROR",
    });
    res.status(500).json({ message: "Server error" });
  }
};

// Enhanced refresh token function
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      await userInfoLog(
        "warn",
        "Token refresh attempt without refresh token",
        req,
        null,
        {
          activityType: "TOKEN_REFRESH",
          status: "NO_REFRESH_TOKEN",
        }
      );
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      await userInfoLog(
        "warn",
        "Token refresh for non-existent user",
        req,
        null,
        {
          userId: decoded.id,
          activityType: "TOKEN_REFRESH",
          status: "USER_NOT_FOUND",
        }
      );
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    await auditLog("TOKEN_REFRESH", req, user, "SUCCESS", {
      activityType: "TOKEN_REFRESH",
      status: "SUCCESS",
      deviceInfo: {
        type: req.geoLocation.deviceType,
        name: req.geoLocation.deviceName,
        browser: req.geoLocation.browser,
        platform: req.geoLocation.platform,
      },
      locationInfo: {
        location: req.geoLocation.location,
        country: req.geoLocation.country,
        city: req.geoLocation.city,
        isInternal: req.geoLocation.isInternal,
      },
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    logger.error("Refresh token error", {
      error: error.message,
      tokenType: "refresh",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      requestId: req.requestId,
      activityType: "TOKEN_REFRESH_ERROR",
      status: "ERROR",
    });
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// Enhanced profile function
const getProfile = async (req, res) => {
  try {
    await auditLog("PROFILE_ACCESS", req, req.user, "SUCCESS", {
      activityType: "PROFILE_ACCESS",
      status: "SUCCESS",
      deviceInfo: {
        type: req.geoLocation.deviceType,
        name: req.geoLocation.deviceName,
        browser: req.geoLocation.browser,
        platform: req.geoLocation.platform,
      },
      locationInfo: {
        location: req.geoLocation.location,
        country: req.geoLocation.country,
        city: req.geoLocation.city,
        isInternal: req.geoLocation.isInternal,
      },
    });

    await userInfoLog("info", "User profile accessed", req, req.user, {
      activityType: "PROFILE_ACCESS",
      status: "SUCCESS",
      accessTime: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    logger.error("Error fetching profile", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id?.toString(),
      username: req.user?.name,
      email: req.user?.email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      requestId: req.requestId,
      activityType: "PROFILE_ACCESS_ERROR",
      status: "ERROR",
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
