// server/config/redis.js
const { Redis } = require("@upstash/redis");

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  console.warn(
    "⚠️ UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN missing in .env"
  );
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// quick connectivity check
(async () => {
  try {
    await redis.ping();
    console.log("✅ Upstash Redis connected");
  } catch (err) {
    console.error("❌ Upstash Redis connect error:", err);
  }
})();

module.exports = redis;
