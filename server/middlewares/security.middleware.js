const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const xss = require("xss-clean");

// Rate limiting for different endpoints
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => {
      return req.user?.id || req.ip || req.headers['x-forwarded-for'] || 'unknown';
    }
  });
};

// Security middleware stack
const securityMiddleware = [
  // Prevent NoSQL injection
  mongoSanitize(),
  
  // Prevent XSS attacks
  xss(),
  
  // Prevent parameter pollution
  hpp({
    whitelist: ['page', 'limit', 'sort', 'fields']
  }),
  
  // API rate limiting
  createRateLimiter(15 * 60 * 1000, 100, 'Too many requests from this IP'),
  
  // Login rate limiting
  createRateLimiter(15 * 60 * 1000, 5, 'Too many login attempts'),
  
  // Register rate limiting
  createRateLimiter(60 * 60 * 1000, 2, 'Too many registration attempts')
];

module.exports = securityMiddleware;