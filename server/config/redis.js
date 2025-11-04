// const { Redis } = require("@upstash/redis");

// class RedisClient {
//   constructor() {
//     this.redis = new Redis({
//       url: process.env.UPSTASH_REDIS_REST_URL,
//       token: process.env.UPSTASH_REDIS_REST_TOKEN,
//       retry: {
//         retries: 3,
//         backoff: (retryCount) => Math.min(retryCount * 100, 3000),
//       },
//     });
//     this.connected = false;
//     this.init();
//   }

//   async init() {
//     try {
//       await this.redis.ping();
//       this.connected = true;
//       console.log("✅ Upstash Redis connected successfully");
//     } catch (error) {
//       console.error("❌ Redis connection failed:", error.message);
//       this.connected = false;
//     }
//   }

//   async set(key, value, options = {}) {
//     if (!this.connected) return null;
//     try {
//       return await this.redis.set(key, value, options);
//     } catch (error) {
//       console.error("Redis SET error:", error.message);
//       return null;
//     }
//   }

//   async get(key) {
//     if (!this.connected) return null;
//     try {
//       return await this.redis.get(key);
//     } catch (error) {
//       console.error("Redis GET error:", error.message);
//       return null;
//     }
//   }

//   async del(key) {
//     if (!this.connected) return null;
//     try {
//       return await this.redis.del(key);
//     } catch (error) {
//       console.error("Redis DEL error:", error.message);
//       return null;
//     }
//   }

//   async exists(key) {
//     if (!this.connected) return 0;
//     try {
//       return await this.redis.exists(key);
//     } catch (error) {
//       console.error("Redis EXISTS error:", error.message);
//       return 0;
//     }
//   }

//   async expire(key, seconds) {
//     if (!this.connected) return null;
//     try {
//       return await this.redis.expire(key, seconds);
//     } catch (error) {
//       console.error("Redis EXPIRE error:", error.message);
//       return null;
//     }
//   }
// }

// // Singleton instance
// module.exports = new RedisClient();

const { Redis } = require("@upstash/redis");

// Create Redis instance with Upstash configuration
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.min(retryCount * 100, 3000),
  },
});

// Test connection
(async () => {
  try {
    const startTime = Date.now();
    const result = await redis.ping();
    const endTime = Date.now();

    console.log("✅ Upstash Redis connected successfully");
    console.log(`📊 Response time: ${endTime - startTime}ms`);

    // Test basic operations
    await redis.set("connection_test", "success", { ex: 10 });
    const testResult = await redis.get("connection_test");

    if (testResult === "success") {
      console.log("✅ Redis operations working correctly");
    }
  } catch (err) {
    console.error("❌ Upstash Redis connection failed:", err.message);
    console.log("💡 Please check your environment variables:");
    console.log("   - UPSTASH_REDIS_REST_URL");
    console.log("   - UPSTASH_REDIS_REST_TOKEN");
  }
})();

module.exports = redis;
