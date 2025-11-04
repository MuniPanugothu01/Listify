// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    loginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lastLoginAttempt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

