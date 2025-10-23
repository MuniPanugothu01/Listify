const redis = require("../config/redis");

/**
 * Simple Upstash-based rate limiter.
 * Works per IP or per user key.
 */
const createRateLimiter = ({
  keyPrefix,
  limit,
  windowMs,
  message = "Too many requests. Please try again later.",
}) => {
  return async (req, res, next) => {
    try {
      const identifier =
        req.user?.id || req.ip || req.headers["x-forwarded-for"];
      const key = `${keyPrefix}:${identifier}`;
      const now = Date.now();
      const ttlSec = Math.ceil(windowMs / 1000);

      // Increment counter atomically
      const count = await redis.incr(key);

      if (count === 1) {
        // First request — set expiry window
        await redis.expire(key, ttlSec);
      }

      if (count > limit) {
        const ttl = await redis.ttl(key);
        return res.status(429).json({
          success: false,
          message,
          retryAfter: ttl,
        });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      next();
    }
  };
};

// Global limiter: 200 requests / 15 minutes per IP
const globalLimiter = createRateLimiter({
  keyPrefix: "global",
  limit: 200,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP. Try again later.",
});

// Login limiter: 5 login attempts / 5 minutes per IP
const loginLimiterIP = createRateLimiter({
  keyPrefix: "login",
  limit: 5,
  windowMs: 5 * 60 * 1000,
  message: "Too many login attempts. Please wait before retrying.",
});

// Register rate limiter
const registerLimiterIP = createRateLimiter({
  keyPrefix: "register",
  limit: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many registration attempts. Please try again after an hour.",
});

// User-specific sliding window using ZSET
const userSlidingWindow = ({ limit = 100, windowMs = 60 * 1000 } = {}) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next();

      const key = `rl:uid:${userId}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      await redis.zadd(key, { score: now, member: `${now}` });
      await redis.zremrangebyscore(key, 0, windowStart);
      const count = await redis.zcard(key);

      await redis.expire(key, Math.ceil(windowMs / 1000) + 1);
      if (count > limit) {
        return res.status(429).json({
          success: false,
          message: "Too many user requests. Try again later.",
        });
      }

      next();
    } catch (err) {
      console.error("userSlidingWindow error:", err);
      next();
    }
  };
};

// Failed login and account lock
const incrFailedAttempt = async ({ userId, windowSec = 15 * 60 }) => {
  try {
    const key = `fail:${userId}`;
    const count = await redis.incr(key);
    if (Number(count) === 1) {
      await redis.expire(key, windowSec);
    }
    const ttl = await redis.ttl(key);
    return { count: Number(count), ttl: Number(ttl) };
  } catch (err) {
    console.error("incrFailedAttempt error:", err);
    return { count: 0, ttl: 0 };
  }
};

const resetFailedAttempts = async (userId) => {
  try {
    await redis.del(`fail:${userId}`);
  } catch (err) {
    console.error("resetFailedAttempts error:", err);
  }
};

const lockAccountRedis = async (userId, lockSeconds = 15 * 60) => {
  try {
    await redis.set(`lock:${userId}`, "1", { ex: lockSeconds });
  } catch (err) {
    console.error("lockAccountRedis error:", err);
  }
};

const isAccountLockedRedis = async (userId) => {
  try {
    const exists = await redis.exists(`lock:${userId}`);
    return exists === 1;
  } catch (err) {
    console.error("isAccountLockedRedis error:", err);
    return false;
  }
};

module.exports = {
  globalLimiter,
  loginLimiterIP,
  registerLimiterIP,
  userSlidingWindow,
  incrFailedAttempt,
  resetFailedAttempts,
  lockAccountRedis,
  isAccountLockedRedis,
};
