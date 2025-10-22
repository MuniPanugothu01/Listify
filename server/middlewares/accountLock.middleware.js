// server/middlewares/accountLock.middleware.js
const { isAccountLockedRedis } = require("./rateLimiter.middleware");
const User = require("../models/User");

const checkAccountLock = async (req, res, next) => {
  try {
    const email = req.body?.email;
    if (!email) return next();

    const user = await User.findOne({ email });
    if (!user) return next();

    const locked = await isAccountLockedRedis(user._id.toString());
    if (locked) {
      return res
        .status(423)
        .json({ message: "Account temporarily locked. Try again later." });
    }

    // fallback DB check
    if (user.isLocked) {
      return res
        .status(423)
        .json({ message: "Account locked. Contact support." });
    }

    req.userRecord = user;
    next();
  } catch (err) {
    console.error("checkAccountLock error:", err);
    next();
  }
};

module.exports = checkAccountLock;
