const UserSession = require("../models/UserSession");
const { userInfoLog } = require("../utils/logger");

const listSessions = async (req, res) => {
  try {
    const sessions = await UserSession.find({ user: req.user._id })
      .select("-token")
      .sort({ createdAt: -1 });

    await userInfoLog("info", "User sessions listed", req, req.user, {
      sessionCount: sessions.length,
    });

    res.status(200).json({
      success: true,
      sessions: sessions,
    });
  } catch (error) {
    await userInfoLog("error", "Error listing sessions", req, req.user, {
      error: error.message,
    });
    res.status(500).json({ message: "Server error" });
  }
};

const revokeSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await UserSession.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!session) {
      await userInfoLog(
        "warn",
        "Session not found for revocation",
        req,
        req.user,
        {
          sessionId: id,
        }
      );
      return res.status(404).json({ message: "Session not found" });
    }

    await UserSession.findByIdAndDelete(id);

    await userInfoLog("info", "Session revoked successfully", req, req.user, {
      sessionId: id,
      device: session.device,
      browser: session.browser,
    });

    res.status(200).json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error) {
    await userInfoLog("error", "Error revoking session", req, req.user, {
      error: error.message,
      sessionId: req.params.id,
    });
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  listSessions,
  revokeSession,
};