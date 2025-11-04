// const redis = require("../config/redis");

// /**
//  * Simple Upstash-based rate limiter.
//  * Works per IP or per user key.
//  */
// const createRateLimiter = ({
//   keyPrefix,
//   limit,
//   windowMs,
//   message = "Too many requests. Please try again later.",
// }) => {
//   return async (req, res, next) => {
//     try {
//       const identifier =
//         req.user?.id || req.ip || req.headers["x-forwarded-for"];
//       const key = `${keyPrefix}:${identifier}`;
//       const now = Date.now();
//       const ttlSec = Math.ceil(windowMs / 1000);

//       // Increment counter atomically
//       const count = await redis.incr(key);

//       if (count === 1) {
//         // First request — set expiry window
//         await redis.expire(key, ttlSec);
//       }

//       if (count > limit) {
//         const ttl = await redis.ttl(key);
//         return res.status(429).json({
//           success: false,
//           message,
//           retryAfter: ttl,
//         });
//       }

//       next();
//     } catch (err) {
//       console.error("Rate limiter error:", err);
//       next();
//     }
//   };
// };

// // Global limiter: 200 requests / 15 minutes per IP
// const globalLimiter = createRateLimiter({
//   keyPrefix: "global",
//   limit: 200,
//   windowMs: 15 * 60 * 1000,
//   message: "Too many requests from this IP. Try again later.",
// });

// // Login limiter: 5 login attempts / 5 minutes per IP
// const loginLimiterIP = createRateLimiter({
//   keyPrefix: "login",
//   limit: 5,
//   windowMs: 5 * 60 * 1000,
//   message: "Too many login attempts. Please wait before retrying.",
// });

// // Register rate limiter
// const registerLimiterIP = createRateLimiter({
//   keyPrefix: "register",
//   limit: 3,
//   windowMs: 60 * 60 * 1000, // 1 hour
//   message: "Too many registration attempts. Please try again after an hour.",
// });

// // User-specific sliding window using ZSET
// const userSlidingWindow = ({ limit = 100, windowMs = 60 * 1000 } = {}) => {
//   return async (req, res, next) => {
//     try {
//       const userId = req.user?.id;
//       if (!userId) return next();

//       const key = `rl:uid:${userId}`;
//       const now = Date.now();
//       const windowStart = now - windowMs;

//       await redis.zadd(key, { score: now, member: `${now}` });
//       await redis.zremrangebyscore(key, 0, windowStart);
//       const count = await redis.zcard(key);

//       await redis.expire(key, Math.ceil(windowMs / 1000) + 1);
//       if (count > limit) {
//         return res.status(429).json({
//           success: false,
//           message: "Too many user requests. Try again later.",
//         });
//       }

//       next();
//     } catch (err) {
//       console.error("userSlidingWindow error:", err);
//       next();
//     }
//   };
// };

// // Failed login and account lock
// const incrFailedAttempt = async ({ userId, windowSec = 15 * 60 }) => {
//   try {
//     const key = `fail:${userId}`;
//     const count = await redis.incr(key);
//     if (Number(count) === 1) {
//       await redis.expire(key, windowSec);
//     }
//     const ttl = await redis.ttl(key);
//     return { count: Number(count), ttl: Number(ttl) };
//   } catch (err) {
//     console.error("incrFailedAttempt error:", err);
//     return { count: 0, ttl: 0 };
//   }
// };

// const resetFailedAttempts = async (userId) => {
//   try {
//     await redis.del(`fail:${userId}`);
//   } catch (err) {
//     console.error("resetFailedAttempts error:", err);
//   }
// };

// const lockAccountRedis = async (userId, lockSeconds = 15 * 60) => {
//   try {
//     await redis.set(`lock:${userId}`, "1", { ex: lockSeconds });
//   } catch (err) {
//     console.error("lockAccountRedis error:", err);
//   }
// };

// const isAccountLockedRedis = async (userId) => {
//   try {
//     const exists = await redis.exists(`lock:${userId}`);
//     return exists === 1;
//   } catch (err) {
//     console.error("isAccountLockedRedis error:", err);
//     return false;
//   }
// };

// module.exports = {
//   globalLimiter,
//   loginLimiterIP,
//   registerLimiterIP,
//   userSlidingWindow,
//   incrFailedAttempt,
//   resetFailedAttempts,
//   lockAccountRedis,
//   isAccountLockedRedis,
// };

const redis = require("../config/redis");

const createRateLimiter = ({
  keyPrefix,
  limit,
  windowMs,
  message = "Too many requests. Please try again later.",
}) => {
  return async (req, res, next) => {
    try {
      const identifier =
        req.user?.id || req.ip || req.headers["x-forwarded-for"] || "unknown";
      const key = `${keyPrefix}:${identifier}`;

      // Upstash Redis: Use pipeline for better performance
      const pipeline = redis.pipeline();
      pipeline.incr(key);
      pipeline.ttl(key);

      const results = await pipeline.exec();
      const count = results[0].result;
      const currentTtl = results[1].result;

      // Set expiry only if this is the first request or key has no expiry
      if (count === 1 || currentTtl === -1) {
        await redis.expire(key, Math.ceil(windowMs / 1000));
      }

      if (count > limit) {
        const ttl = await redis.ttl(key);
        return res.status(429).json({
          success: false,
          message,
          retryAfter: ttl,
          remaining: Math.max(0, limit - count),
        });
      }

      // Add rate limit headers
      res.set({
        "X-RateLimit-Limit": limit,
        "X-RateLimit-Remaining": Math.max(0, limit - count),
        "X-RateLimit-Reset":
          Math.ceil(Date.now() / 1000) +
          (currentTtl > 0 ? currentTtl : Math.ceil(windowMs / 1000)),
      });

      next();
    } catch (err) {
      console.error("Rate limiter error:", err.message);
      next(); // Continue on Redis errors
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
  keyPrefix: "login_ip",
  limit: 5,
  windowMs: 5 * 60 * 1000,
  message: "Too many login attempts. Please wait before retrying.",
});

// Register rate limiter
const registerLimiterIP = createRateLimiter({
  keyPrefix: "register_ip",
  limit: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many registration attempts. Please try again after an hour.",
});

// Enhanced failed login and account lock functions for Upstash
const incrFailedAttempt = async ({ userId, windowSec = 15 * 60 }) => {
  try {
    const key = `fail:${userId}`;

    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.ttl(key);

    const results = await pipeline.exec();
    const count = results[0].result;
    const currentTtl = results[1].result;

    if (count === 1 || currentTtl === -1) {
      await redis.expire(key, windowSec);
    }

    const ttl = await redis.ttl(key);
    return {
      count: Number(count),
      ttl: Number(ttl),
      remaining: Math.max(0, 5 - count), // Assuming FAIL_LIMIT=5
    };
  } catch (err) {
    console.error("incrFailedAttempt error:", err.message);
    return { count: 0, ttl: 0, remaining: 5 };
  }
};

const resetFailedAttempts = async (userId) => {
  try {
    await redis.del(`fail:${userId}`);
  } catch (err) {
    console.error("resetFailedAttempts error:", err.message);
  }
};

const lockAccountRedis = async (userId, lockSeconds = 15 * 60) => {
  try {
    // Set lock with expiry and additional metadata
    const lockData = {
      lockedAt: new Date().toISOString(),
      reason: "too_many_failed_attempts",
      expiresAt: new Date(Date.now() + lockSeconds * 1000).toISOString(),
    };

    await redis.set(`lock:${userId}`, JSON.stringify(lockData), {
      ex: lockSeconds,
    });

    // Also set a simple flag for quick checking
    await redis.set(`lock_flag:${userId}`, "1", { ex: lockSeconds });
  } catch (err) {
    console.error("lockAccountRedis error:", err.message);
  }
};

const isAccountLockedRedis = async (userId) => {
  try {
    // Quick check with simple flag first
    const quickCheck = await redis.exists(`lock_flag:${userId}`);
    if (quickCheck === 1) {
      return true;
    }

    // Detailed check with lock data
    const lockData = await redis.get(`lock:${userId}`);
    return lockData !== null;
  } catch (err) {
    console.error("isAccountLockedRedis error:", err.message);
    return false;
  }
};

const getLockDetails = async (userId) => {
  try {
    const lockData = await redis.get(`lock:${userId}`);
    if (!lockData) return null;

    return JSON.parse(lockData);
  } catch (err) {
    console.error("getLockDetails error:", err.message);
    return null;
  }
};

module.exports = {
  globalLimiter,
  loginLimiterIP,
  registerLimiterIP,
  incrFailedAttempt,
  resetFailedAttempts,
  lockAccountRedis,
  isAccountLockedRedis,
  getLockDetails,
};
