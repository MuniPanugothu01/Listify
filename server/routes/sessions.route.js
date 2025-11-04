const express = require("express");
const { protect } = require("../middlewares/auth.middleware"); // middleware to verify token and attach user
const {
  listSessions,
  revokeSession,
} = require("../controllers/sessions.controller");

const router = express.Router();

router.use(protect); // all routes below require login

// GET /api/sessions -> list all sessions for the logged-in user
router.get("/", listSessions);

// DELETE /api/sessions/:id -> revoke (delete) one session
router.delete("/:id", revokeSession);

module.exports = router;
