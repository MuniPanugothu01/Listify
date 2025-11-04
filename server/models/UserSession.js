const mongoose = require("mongoose");

const userSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  token: {
    type: String,
    required: true
  },
  device: String,
  browser: String,
  platform: String,
  ip: String,
  location: String,
  userAgent: String,
  loginTime: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSessionSchema.index({ user: 1 });
userSessionSchema.index({ token: 1 });
userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("UserSession", userSessionSchema);