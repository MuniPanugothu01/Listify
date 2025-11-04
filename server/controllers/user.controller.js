const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/TokenBlacklist");
const UserSession = require("../models/UserSession");
const User = require("../models/User");
const { logger, auditLog, userInfoLog } = require("../utils/logger");

// Enhanced user details extraction function
const getUserDetailsForLogging = (user) => {
  if (!user) return null;

  return {
    userId: user._id?.toString(),
    userName: user.name,
    userEmail: user.email,
    userLoginAttempts: user.loginAttempts,
    userIsLocked: user.isLocked,
    userLastLogin: user.lastLogin,
    userCreatedAt: user.createdAt,
    userUpdatedAt: user.updatedAt,
  };
};

// Enhanced request details extraction function
const getRequestDetailsForLogging = (req) => {
  return {
    requestId: req.requestId,
    requestMethod: req.method,
    requestUrl: req.url,
    clientIP: req.ip,
    userAgent: req.headers["user-agent"],
    clientLocation: req.clientLocation || "unknown",
    geoLocation: req.geoLocation || {},
  };
};

// Register function with enhanced logging
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Enhanced logging for registration attempt
    await userInfoLog("info", "Registration attempt initiated", req, null, {
      activityType: "REGISTRATION_ATTEMPT",
      status: "INITIATED",
      userDetails: {
        attemptedName: name,
        attemptedEmail: email,
      },
      requestDetails: getRequestDetailsForLogging(req),
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await userInfoLog(
        "warn",
        "Registration attempt with existing email",
        req,
        existingUser,
        {
          activityType: "REGISTRATION_ATTEMPT",
          status: "DUPLICATE_EMAIL",
          userDetails: getUserDetailsForLogging(existingUser),
          requestDetails: getRequestDetailsForLogging(req),
          conflictDetails: {
            existingUserId: existingUser._id?.toString(),
            existingUserEmail: existingUser.email,
          },
        }
      );
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Set refresh token as cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Create user session
    const userSession = await UserSession.create({
      user: user._id,
      token: accessToken,
      device: req.headers["user-agent"] || "unknown",
      ip: req.ip,
      location: req.clientLocation || "unknown",
      loginTime: new Date(),
    });

    // Enhanced logging for successful registration
    await auditLog("USER_REGISTERED", req, user, "SUCCESS", {
      activityType: "REGISTRATION",
      registrationMethod: "email",
      userDetails: getUserDetailsForLogging(user),
      sessionDetails: {
        sessionId: userSession._id?.toString(),
        device: userSession.device,
        location: userSession.location,
        loginTime: userSession.loginTime,
      },
      tokenDetails: {
        accessTokenExpires: "15m",
        refreshTokenExpires: "7d",
      },
    });

    await userInfoLog("info", "User registered successfully", req, user, {
      activityType: "REGISTRATION_SUCCESS",
      userDetails: getUserDetailsForLogging(user),
      registrationDetails: {
        timestamp: new Date().toISOString(),
        sessionCreated: true,
        tokensGenerated: true,
      },
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
    // Enhanced logging for registration error
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      attemptedEmail: req.body.email,
      attemptedName: req.body.name,
      activityType: "REGISTRATION_ERROR",
      userDetails: {
        attemptedEmail: req.body.email,
        attemptedName: req.body.name,
      },
      requestDetails: getRequestDetailsForLogging(req),
    };

    await userInfoLog("error", "Registration failed", req, null, errorDetails);

    logger.error("Registration error", errorDetails);

    res.status(500).json({ message: "Server error" });
  }
};

// Login function with enhanced logging
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Enhanced logging for login attempt
    await userInfoLog("info", "Login attempt initiated", req, null, {
      activityType: "LOGIN_ATTEMPT",
      status: "INITIATED",
      userDetails: {
        attemptedEmail: email,
      },
      requestDetails: getRequestDetailsForLogging(req),
    });

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      await userInfoLog(
        "warn",
        "Login attempt with non-existent email",
        req,
        null,
        {
          activityType: "LOGIN_ATTEMPT",
          status: "USER_NOT_FOUND",
          userDetails: {
            attemptedEmail: email,
          },
          requestDetails: getRequestDetailsForLogging(req),
          securityDetails: {
            reason: "User not found in database",
          },
        }
      );
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if account is locked
    if (user.isLocked) {
      await userInfoLog("warn", "Login attempt to locked account", req, user, {
        activityType: "LOGIN_ATTEMPT",
        status: "ACCOUNT_LOCKED",
        userDetails: getUserDetailsForLogging(user),
        requestDetails: getRequestDetailsForLogging(req),
        securityDetails: {
          lockReason: "Too many failed attempts",
          loginAttempts: user.loginAttempts,
          lastLoginAttempt: user.lastLoginAttempt,
        },
      });
      return res.status(423).json({
        message: "Account locked. Please try again after 15 minutes.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      user.lastLoginAttempt = new Date();

      if (user.loginAttempts >= 5) {
        user.isLocked = true;

        // Enhanced logging for account lock
        await auditLog("ACCOUNT_LOCKED", req, user, "LOCKED", {
          activityType: "ACCOUNT_LOCK",
          userDetails: getUserDetailsForLogging(user),
          securityDetails: {
            reason: "Too many failed login attempts",
            totalFailedAttempts: user.loginAttempts,
            lockTimestamp: new Date().toISOString(),
            autoUnlockAfter: "15 minutes",
          },
        });
      }
      await user.save();

      await userInfoLog("warn", "Failed login attempt", req, user, {
        activityType: "LOGIN_ATTEMPT",
        status: "FAILED",
        userDetails: getUserDetailsForLogging(user),
        securityDetails: {
          currentAttempts: user.loginAttempts,
          remainingAttempts: Math.max(0, 5 - user.loginAttempts),
          lastFailedAttempt: user.lastLoginAttempt,
        },
      });

      return res.status(400).json({
        message: `Invalid credentials. ${Math.max(
          0,
          5 - user.loginAttempts
        )} attempts remaining.`,
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.isLocked = false;
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Set refresh token as cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Create user session
    const userSession = await UserSession.create({
      user: user._id,
      token: accessToken,
      device: req.headers["user-agent"] || "unknown",
      ip: req.ip,
      location: req.clientLocation || "unknown",
      loginTime: new Date(),
    });

    // Get active sessions count
    const activeSessions = await UserSession.countDocuments({
      user: user._id,
      isActive: true,
    });

    // Enhanced logging for successful login
    await auditLog("USER_LOGGED_IN", req, user, "SUCCESS", {
      activityType: "LOGIN",
      loginMethod: "email",
      userDetails: getUserDetailsForLogging(user),
      sessionDetails: {
        sessionId: userSession._id?.toString(),
        device: userSession.device,
        location: userSession.location,
        loginTime: userSession.loginTime,
        totalActiveSessions: activeSessions,
      },
      tokenDetails: {
        accessTokenExpires: "15m",
        refreshTokenExpires: "7d",
      },
    });

    await userInfoLog("info", "User logged in successfully", req, user, {
      activityType: "LOGIN_SUCCESS",
      userDetails: getUserDetailsForLogging(user),
      loginDetails: {
        timestamp: new Date().toISOString(),
        sessionCreated: true,
        activeSessionsCount: activeSessions,
        deviceInfo: req.geoLocation || {},
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
    // Enhanced logging for login error
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      attemptedEmail: req.body.email,
      activityType: "LOGIN_ERROR",
      userDetails: {
        attemptedEmail: req.body.email,
      },
      requestDetails: getRequestDetailsForLogging(req),
    };

    await userInfoLog("error", "Login failed", req, null, errorDetails);

    logger.error("Login error", errorDetails);

    res.status(500).json({ message: "Server error" });
  }
};

// Logout function with enhanced logging
const logoutUser = async (req, res) => {
  try {
    const token = req.token;
    const decoded = req.decodedToken;

    if (!token) {
      await userInfoLog("warn", "Logout attempt without token", req, null, {
        activityType: "LOGOUT_ATTEMPT",
        status: "NO_TOKEN",
        requestDetails: getRequestDetailsForLogging(req),
      });
      return res.status(401).json({ message: "No token provided" });
    }

    // Add token to blacklist with expiry
    const expiry = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000);

    const blacklistedToken = await TokenBlacklist.create({
      token,
      expiresAt: expiry,
    });

    // Remove user session
    const sessionResult = await UserSession.findOneAndDelete({ token });

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // Enhanced logging for successful logout
    if (req.user) {
      await auditLog("USER_LOGGED_OUT", req, req.user, "SUCCESS", {
        activityType: "LOGOUT",
        userDetails: getUserDetailsForLogging(req.user),
        logoutDetails: {
          timestamp: new Date().toISOString(),
          sessionRemoved: !!sessionResult,
          tokenBlacklisted: true,
          tokenExpiry: blacklistedToken.expiresAt,
          sessionId: sessionResult?._id?.toString(),
        },
      });

      await userInfoLog("info", "User logged out successfully", req, req.user, {
        activityType: "LOGOUT_SUCCESS",
        userDetails: getUserDetailsForLogging(req.user),
        logoutDetails: {
          sessionRemoved: !!sessionResult,
          tokenInvalidated: true,
        },
      });
    } else {
      // Log token invalidation for expired tokens
      await userInfoLog("info", "Token invalidated during logout", req, null, {
        activityType: "TOKEN_INVALIDATED",
        tokenDetails: {
          tokenExpired: !decoded,
          userIdFromToken: decoded?.id,
        },
        logoutDetails: {
          sessionRemoved: !!sessionResult,
          tokenBlacklisted: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    // Enhanced logging for logout error
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      activityType: "LOGOUT_ERROR",
      userDetails: req.user ? getUserDetailsForLogging(req.user) : null,
      requestDetails: getRequestDetailsForLogging(req),
      tokenDetails: {
        tokenProvided: !!req.token,
        userFromToken: req.decodedToken?.id,
      },
    };

    await userInfoLog(
      "error",
      "Logout failed",
      req,
      req.user || null,
      errorDetails
    );

    logger.error("Logout error", errorDetails);

    // Clear cookie even on error
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(500).json({ message: "Logout failed" });
  }
};

// Refresh token function with enhanced logging
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
          requestDetails: getRequestDetailsForLogging(req),
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
          activityType: "TOKEN_REFRESH",
          status: "USER_NOT_FOUND",
          tokenDetails: {
            userIdFromToken: decoded.id,
          },
          requestDetails: getRequestDetailsForLogging(req),
        }
      );
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Enhanced logging for token refresh
    await auditLog("TOKEN_REFRESHED", req, user, "SUCCESS", {
      activityType: "TOKEN_REFRESH",
      userDetails: getUserDetailsForLogging(user),
      tokenDetails: {
        refreshTokenUserId: decoded.id,
        newAccessTokenExpires: "15m",
      },
    });

    await userInfoLog("info", "Token refreshed successfully", req, user, {
      activityType: "TOKEN_REFRESH_SUCCESS",
      userDetails: getUserDetailsForLogging(user),
      refreshDetails: {
        timestamp: new Date().toISOString(),
        newTokenGenerated: true,
      },
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    // Enhanced logging for token refresh error
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      activityType: "TOKEN_REFRESH_ERROR",
      tokenDetails: {
        tokenType: "refresh",
        errorType: error.name,
      },
      requestDetails: getRequestDetailsForLogging(req),
    };

    await userInfoLog("error", "Token refresh failed", req, null, errorDetails);

    logger.error("Refresh token error", errorDetails);

    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// Profile function with enhanced logging
const getProfile = async (req, res) => {
  try {
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      lastLogin: req.user.lastLogin,
      createdAt: req.user.createdAt,
    };

    // Enhanced logging for profile access
    await auditLog("PROFILE_ACCESSED", req, req.user, "SUCCESS", {
      activityType: "PROFILE_ACCESS",
      userDetails: getUserDetailsForLogging(req.user),
      accessDetails: {
        timestamp: new Date().toISOString(),
        dataAccessed: ["id", "name", "email", "lastLogin", "createdAt"],
      },
    });

    await userInfoLog("info", "User profile accessed", req, req.user, {
      activityType: "PROFILE_ACCESS_SUCCESS",
      userDetails: getUserDetailsForLogging(req.user),
      profileDetails: {
        accessTime: new Date().toISOString(),
        fieldsReturned: Object.keys(userData),
      },
    });

    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    // Enhanced logging for profile access error
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      activityType: "PROFILE_ACCESS_ERROR",
      userDetails: req.user ? getUserDetailsForLogging(req.user) : null,
      requestDetails: getRequestDetailsForLogging(req),
    };

    await userInfoLog(
      "error",
      "Profile access failed",
      req,
      req.user,
      errorDetails
    );

    logger.error("Profile access error", errorDetails);

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
