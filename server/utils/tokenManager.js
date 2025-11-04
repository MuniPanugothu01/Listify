const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class TokenManager {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.refreshSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!this.jwtSecret || !this.refreshSecret) {
      throw new Error("JWT secrets must be defined in environment variables");
    }
  }

  generateAccessToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      type: "access",
      jti: crypto.randomBytes(16).toString("hex"), // Unique token ID
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: process.env.TOKEN_EXPIRY || "15m",
      issuer: "auth-service",
      audience: "user",
    });
  }

  generateRefreshToken(user) {
    const payload = {
      id: user._id,
      type: "refresh",
      jti: crypto.randomBytes(16).toString("hex"),
    };

    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
      issuer: "auth-service",
      audience: "user",
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret, {
        issuer: "auth-service",
        audience: "user",
      });
    } catch (error) {
      throw new Error("Invalid or expired access token");
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshSecret, {
        issuer: "auth-service",
        audience: "user",
      });
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

// Export an instance of the class
module.exports = new TokenManager();