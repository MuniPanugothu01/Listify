// server/models/UserSession.js
const mongoose = require("mongoose");

const UserSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: String,
  device: String,
  ip: String,
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // auto expire
});

module.exports = mongoose.model("UserSession", UserSessionSchema);
