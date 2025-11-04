const jwt = require("jsonwebtoken");
const User = require("../models/User");
const TokenBlacklist = require("../models/TokenBlacklist");
const { logger, userInfoLog } = require("../utils/logger");

// Protect middleware for routes that require authentication
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await userInfoLog("warn", "Access attempt without authorization header", req, null, {
        activityType: "AUTH_MIDDLEWARE",
        status: "NO_TOKEN"
      });
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]?.trim();
    if (!token) {
      await userInfoLog("warn", "Access attempt with empty token", req, null, {
        activityType: "AUTH_MIDDLEWARE",
        status: "EMPTY_TOKEN"
      });
      return res.status(401).json({ message: "No token provided" });
    }

    // Check if token is blacklisted
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      await userInfoLog("warn", "Access attempt with blacklisted token", req, null, {
        activityType: "AUTH_MIDDLEWARE",
        status: "BLACKLISTED_TOKEN"
      });
      return res.status(401).json({ message: "Token invalidated. Please log in again." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      await userInfoLog("warn", "Access attempt for non-existent user", req, null, {
        userId: decoded.id,
        activityType: "AUTH_MIDDLEWARE",
        status: "USER_NOT_FOUND"
      });
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user and token to request
    req.user = user;
    req.token = token;

    // Log successful authentication
    await userInfoLog("info", "User authenticated successfully", req, user, {
      activityType: "AUTH_SUCCESS"
    });
    
    next();
  } catch (err) {
    // Log authentication errors
    if (err.name === "TokenExpiredError") {
      await userInfoLog("warn", "Access attempt with expired token", req, null, {
        activityType: "AUTH_MIDDLEWARE",
        status: "TOKEN_EXPIRED"
      });
      return res.status(401).json({ message: "Token expired" });
    }
    
    if (err.name === "JsonWebTokenError") {
      await userInfoLog("warn", "Access attempt with invalid token", req, null, {
        activityType: "AUTH_MIDDLEWARE",
        status: "INVALID_TOKEN"
      });
      return res.status(401).json({ message: "Invalid token" });
    }

    await userInfoLog("error", "Authentication middleware error", req, null, {
      error: err.message,
      activityType: "AUTH_MIDDLEWARE_ERROR"
    });

    logger.error("Auth middleware error", {
      error: err.message,
      stack: err.stack,
      ip: req.ip
    });

    res.status(500).json({ message: "Server error during authentication" });
  }
};

// Middleware for logout that allows expired tokens
exports.allowExpiredForLogout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await userInfoLog("warn", "Logout attempt without authorization header", req, null, {
        activityType: "LOGOUT_MIDDLEWARE",
        status: "NO_TOKEN"
      });
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]?.trim();
    if (!token) {
      await userInfoLog("warn", "Logout attempt with empty token", req, null, {
        activityType: "LOGOUT_MIDDLEWARE",
        status: "EMPTY_TOKEN"
      });
      return res.status(401).json({ message: "No token provided" });
    }

    // Check if token is already blacklisted
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      await userInfoLog("info", "Logout attempt with already blacklisted token", req, null, {
        activityType: "LOGOUT_MIDDLEWARE",
        status: "ALREADY_LOGGED_OUT"
      });
      
      res.clearCookie("refreshToken");
      return res.status(200).json({ 
        success: true, 
        message: "Already logged out" 
      });
    }

    let decoded;
    try {
      // Try to verify token normally
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      await userInfoLog("debug", "Logout with valid token", req, null, {
        activityType: "LOGOUT_MIDDLEWARE",
        status: "VALID_TOKEN"
      });
    } catch (err) {
      // If token is expired, decode without verification for logout
      if (err.name === "TokenExpiredError") {
        decoded = jwt.decode(token);
        if (!decoded) {
          await userInfoLog("warn", "Logout attempt with invalid expired token", req, null, {
            activityType: "LOGOUT_MIDDLEWARE",
            status: "INVALID_EXPIRED_TOKEN"
          });
          return res.status(401).json({ message: "Invalid token format" });
        }
        await userInfoLog("debug", "Logout with expired token", req, null, {
          activityType: "LOGOUT_MIDDLEWARE",
          status: "EXPIRED_TOKEN_ALLOWED"
        });
      } else {
        await userInfoLog("warn", "Logout attempt with invalid token", req, null, {
          error: err.message,
          activityType: "LOGOUT_MIDDLEWARE",
          status: "INVALID_TOKEN"
        });
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    if (!decoded || !decoded.id) {
      await userInfoLog("warn", "Logout attempt with token missing user ID", req, null, {
        activityType: "LOGOUT_MIDDLEWARE",
        status: "INVALID_TOKEN_PAYLOAD"
      });
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Get user info if possible
    try {
      const user = await User.findById(decoded.id).select("-password");
      req.user = user;
      if (user) {
        await userInfoLog("debug", "User found for logout", req, user, {
          activityType: "LOGOUT_MIDDLEWARE",
          status: "USER_FOUND"
        });
      }
    } catch (userError) {
      await userInfoLog("warn", "Could not fetch user for logout", req, null, {
        error: userError.message,
        activityType: "LOGOUT_MIDDLEWARE",
        status: "USER_FETCH_FAILED"
      });
      req.user = null;
    }

    // Store token and decoded info for logout controller
    req.token = token;
    req.decodedToken = decoded;
    
    next();
  } catch (err) {
    await userInfoLog("error", "Logout middleware error", req, null, {
      error: err.message,
      activityType: "LOGOUT_MIDDLEWARE_ERROR"
    });

    logger.error("Logout middleware error", {
      error: err.message,
      stack: err.stack,
      ip: req.ip
    });

    res.status(500).json({ message: "Server error during logout" });
  }
};