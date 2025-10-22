// server/routes/sessions.route.js
const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  listSessions,
  revokeSession,
} = require("../controllers/sessions.controller");
const router = express.Router();

router.use(protect);
router.get("/", listSessions);
router.delete("/:id", revokeSession);

module.exports = router;
