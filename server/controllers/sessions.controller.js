// server/controllers/sessions.controller.js
const UserSession = require("../models/UserSession");

// GET /api/users/sessions
const listSessions = async (req, res) => {
  try {
    const sessions = await UserSession.find({ user: req.user._id }).select(
      "-__v"
    );
    res.json({ success: true, sessions });
  } catch (err) {
    console.error("listSessions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/users/sessions/:id
const revokeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await UserSession.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ success: true, message: "Session revoked" });
  } catch (err) {
    console.error("revokeSession error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { listSessions, revokeSession };
