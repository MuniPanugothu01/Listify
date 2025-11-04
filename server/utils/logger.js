require("dotenv").config();
const winston = require("winston");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const { combine, timestamp, json, errors, metadata } = winston.format;

let DailyRotateFile;
let CloudWatchTransport;

try {
  DailyRotateFile = require("winston-daily-rotate-file");
} catch (error) {
  console.log(
    "winston-daily-rotate-file not installed, using basic file transport"
  );
}

try {
  CloudWatchTransport = require("winston-cloudwatch");
} catch (error) {
  console.log(
    "winston-cloudwatch not installed, Run: npm install winston-cloudwatch"
  );
}

const sensitiveFields = [
  "password",
  "token",
  "authorization",
  "secret",
  "creditCard",
  "ssn",
  "cvv",
];

const sanitizeData = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const sanitized = { ...obj };

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) sanitized[field] = "***REDACTED***";
    if (sanitized.body && sanitized.body[field])
      sanitized.body[field] = "***REDACTED***";
  });

  if (sanitized.headers) {
    if (sanitized.headers.authorization)
      sanitized.headers.authorization = "***REDACTED***";
    if (sanitized.headers.cookie) {
      sanitized.headers.cookie = sanitized.headers.cookie.replace(
        /token=[^;]+/,
        "token=***REDACTED***"
      );
    }
  }
  return sanitized;
};

const sanitizeFormat = winston.format((info) => {
  if (info.metadata) {
    info.metadata = sanitizeData(info.metadata);
  }
  if (info.message && typeof info.message === "object") {
    info.message = sanitizeData(info.message);
  }
  return info;
});

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "info";
};

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}] ${message}`;

    if (meta && Object.keys(meta).length > 0) {
      const cleanMeta = { ...meta };
      delete cleanMeta.timestamp;
      delete cleanMeta.level;
      delete cleanMeta.message;
      log += ` ${JSON.stringify(sanitizeData(cleanMeta))}`;
    }
    return log;
  })
);

// Enhanced IP geolocation function
const getIPLocation = async (ip) => {
  // Skip local IPs
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return "Local Network";
  }

  const apiKey = process.env.IP_GEOLOCATION_API_KEY;

  if (!apiKey) {
    return `IP: ${ip}`; // Return just IP if no API key
  }

  try {
    // Using ipgeolocation.io service (you can change to any other service)
    const response = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}&fields=city,state_prov,country_name,continent_name`,
      {
        timeout: 5000, // 5 second timeout
      }
    );

    const data = response.data;
    if (data && data.country_name) {
      const locationParts = [];
      if (data.city) locationParts.push(data.city);
      if (data.state_prov) locationParts.push(data.state_prov);
      if (data.country_name) locationParts.push(data.country_name);

      return locationParts.join(", ") || `IP: ${ip}`;
    }
    return `IP: ${ip}`;
  } catch (error) {
    console.log(`Geolocation API error for IP ${ip}:`, error.message);
    return `IP: ${ip}`; // Fallback to just IP
  }
};

// Enhanced device detection function with location
const detectDeviceInfo = async (userAgent, ip) => {
  if (!userAgent) {
    return {
      device: "unknown",
      browser: "unknown",
      platform: "unknown",
      deviceName: "unknown",
      location: "unknown",
    };
  }

  let device = "desktop";
  let browser = "unknown";
  let platform = "unknown";
  let deviceName = "unknown";
  let location = "unknown";

  // Enhanced Device detection
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    device = "mobile";
    if (/iPhone/.test(userAgent)) deviceName = "iPhone";
    else if (/iPad/.test(userAgent)) deviceName = "iPad";
    else if (/Android/.test(userAgent)) deviceName = "Android Mobile";
    else if (/iPod/.test(userAgent)) deviceName = "iPod Touch";
  } else if (/Tablet|iPad/i.test(userAgent)) {
    device = "tablet";
    deviceName = /iPad/.test(userAgent) ? "iPad" : "Android Tablet";
  } else {
    deviceName = "Desktop Computer";
  }

  // Enhanced Browser detection
  if (/PostmanRuntime/i.test(userAgent)) {
    browser = "Postman";
  } else if (/Chrome\/\d+/.test(userAgent) && !/Edg\/\d+/.test(userAgent)) {
    const chromeVersion = userAgent.match(/Chrome\/(\d+)/);
    browser = chromeVersion ? `Chrome v${chromeVersion[1]}` : "Chrome";
  } else if (/Firefox\/\d+/.test(userAgent)) {
    const firefoxVersion = userAgent.match(/Firefox\/(\d+)/);
    browser = firefoxVersion ? `Firefox v${firefoxVersion[1]}` : "Firefox";
  } else if (/Safari\/\d+/.test(userAgent) && !/Chrome\/\d+/.test(userAgent)) {
    const safariVersion = userAgent.match(/Version\/(\d+\.\d+)/);
    browser = safariVersion ? `Safari v${safariVersion[1]}` : "Safari";
  } else if (/Edg\/\d+/.test(userAgent)) {
    const edgeVersion = userAgent.match(/Edg\/(\d+)/);
    browser = edgeVersion ? `Edge v${edgeVersion[1]}` : "Edge";
  } else if (/OPR\/\d+/.test(userAgent)) {
    const operaVersion = userAgent.match(/OPR\/(\d+)/);
    browser = operaVersion ? `Opera v${operaVersion[1]}` : "Opera";
  }

  // Platform detection
  if (/Windows NT 10/.test(userAgent)) {
    platform = "Windows 10/11";
  } else if (/Windows NT 6.3/.test(userAgent)) {
    platform = "Windows 8.1";
  } else if (/Windows NT 6.2/.test(userAgent)) {
    platform = "Windows 8";
  } else if (/Windows NT 6.1/.test(userAgent)) {
    platform = "Windows 7";
  } else if (/Mac OS X (\d+[._]\d+[._]\d+)/.test(userAgent)) {
    const macVersion = userAgent.match(/Mac OS X (\d+[._]\d+[._]\d+)/);
    platform = macVersion
      ? `macOS ${macVersion[1].replace(/_/g, ".")}`
      : "macOS";
  } else if (/Linux/.test(userAgent)) {
    platform = "Linux";
  } else if (/Android (\d+\.\d+)/.test(userAgent)) {
    const androidVersion = userAgent.match(/Android (\d+\.\d+)/);
    platform = androidVersion ? `Android ${androidVersion[1]}` : "Android";
  } else if (/iOS (\d+_\d+)/.test(userAgent)) {
    const iosVersion = userAgent.match(/iOS (\d+_\d+)/);
    platform = iosVersion ? `iOS ${iosVersion[1].replace(/_/g, ".")}` : "iOS";
  }

  // Get location based on IP
  if (ip) {
    location = await getIPLocation(ip);
  }

  return {
    device,
    browser,
    platform,
    deviceName,
    location,
    userAgent: userAgent.substring(0, 200), // Truncate long user agents
  };
};

// Create logger instance with FIXED metadata handling
const logger = winston.createLogger({
  level: level(),
  levels,
  defaultMeta: {
    service: "auth-service",
    environment: process.env.NODE_ENV || "development",
  },
  format: combine(
    errors({ stack: true }),
    timestamp(),
    sanitizeFormat(),
    metadata({
      fillWith: [
        "userId",
        "userEmail",
        "userName",
        "ip",
        "userAgent",
        "action",
        "status",
        "activityType",
        "requestId",
        "deviceType",
        "browser",
        "platform",
        "location",
      ],
    }),
    // Custom format to merge metadata into the main log object
    winston.format((info) => {
      // Merge metadata into the main info object for CloudWatch
      if (info.metadata && Object.keys(info.metadata).length > 0) {
        return { ...info, ...info.metadata };
      }
      return info;
    })(),
    json()
  ),
  transports: [
    // Console transport always enabled
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

// FIXED CloudWatch setup with proper metadata handling
const setupCloudWatch = async () => {
  if (!CloudWatchTransport) {
    console.log("❌ CloudWatch transport not available");
    return null;
  }

  // Check if AWS CloudWatch is enabled
  if (process.env.ENABLE_CLOUDWATCH !== "true") {
    console.log(
      "ℹ️ CloudWatch logging disabled (ENABLE_CLOUDWATCH not 'true')"
    );
    return null;
  }

  // Check if required AWS environment variables are set
  const requiredEnvVars = [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.log(
      `❌ Missing AWS environment variables: ${missingVars.join(", ")}`
    );
    return null;
  }

  try {
    console.log("🔄 Setting up CloudWatch transport...");

    // Create CloudWatch transport with FIXED message formatter
    const cloudWatchTransport = new CloudWatchTransport({
      logGroupName: process.env.CLOUDWATCH_GROUP || "auth-service-logs",
      logStreamName:
        process.env.CLOUDWATCH_STREAM ||
        `${process.env.NODE_ENV || "development"}-${Date.now()}`,
      awsRegion: process.env.AWS_REGION,
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      retentionInDays: null,
      // FIXED: Use the entire log object, not just log.meta
      messageFormatter: (log) => {
        try {
          // The log object now contains all metadata merged in by our custom format
          return JSON.stringify(log, null, 2);
        } catch (error) {
          return JSON.stringify({
            level: "error",
            message: "Error formatting log for CloudWatch",
            timestamp: new Date().toISOString(),
            originalMessage: log.message,
            error: error.message,
          });
        }
      },
    });

    // Enhanced error handling
    cloudWatchTransport.on("error", (error) => {
      if (error.name === "OperationAbortedException") {
        console.log("⚠️ CloudWatch operation in progress (non-critical)");
        return;
      }
      console.error("❌ CloudWatch Transport Error:", error.message);
    });

    cloudWatchTransport.on("success", () => {
      console.log("✅ CloudWatch log delivered successfully");
    });

    console.log("✅ CloudWatch transport configured successfully");
    return cloudWatchTransport;
  } catch (error) {
    console.error("❌ Failed to setup CloudWatch transport:", error.message);
    return null;
  }
};

// Initialize CloudWatch
const initializeCloudWatch = async () => {
  try {
    const cloudWatchTransport = await setupCloudWatch();

    if (cloudWatchTransport) {
      // Add CloudWatch as a transport
      logger.add(cloudWatchTransport);

      // Test CloudWatch connection with detailed log message
      logger.info("🚀 CloudWatch logging initialized successfully", {
        logGroup: process.env.CLOUDWATCH_GROUP || "auth-service-logs",
        region: process.env.AWS_REGION,
        environment: process.env.NODE_ENV || "development",
        initializationTime: new Date().toISOString(),
        note: "All metadata will be included in CloudWatch logs",
        testData: {
          userId: "test-user-123",
          action: "INITIALIZATION",
          status: "SUCCESS",
        },
      });

      return true;
    } else {
      console.log("❌ CloudWatch logging DISABLED");
      return false;
    }
  } catch (error) {
    console.error("❌ CloudWatch initialization failed:", error.message);
    return false;
  }
};

// FIXED helper functions with enhanced metadata handling
const auditLog = async (
  action,
  req,
  user = null,
  status = "SUCCESS",
  additionalData = {}
) => {
  const userAgent = req?.headers?.["user-agent"];
  const ip = req?.ip || req?.connection?.remoteAddress;
  const deviceInfo = await detectDeviceInfo(userAgent, ip);

  // Create log data - this will be merged into the main log object
  const logData = {
    action,
    status,
    ip: ip,
    userAgent: userAgent,
    deviceType: deviceInfo.device,
    deviceName: deviceInfo.deviceName,
    browser: deviceInfo.browser,
    platform: deviceInfo.platform,
    location: deviceInfo.location,
    requestId: req?.requestId,
    timestamp: new Date().toISOString(),
    logType: "AUDIT",
    ...additionalData,
  };

  if (user) {
    logData.userId = user._id?.toString();
    logData.userName = user.name;
    logData.userEmail = user.email;
    logData.userLoginAttempts = user.loginAttempts;
    logData.userIsLocked = user.isLocked;
  }

  // The metadata will be merged into the main log object by our custom format
  logger.info(`AUDIT: ${action} - ${status}`, logData);
};

const userInfoLog = async (
  level,
  message,
  req,
  user = null,
  additionalData = {}
) => {
  const userAgent = req?.headers?.["user-agent"];
  const ip = req?.ip || req?.connection?.remoteAddress;
  const deviceInfo = await detectDeviceInfo(userAgent, ip);

  const logData = {
    ip: ip,
    userAgent: userAgent,
    deviceType: deviceInfo.device,
    deviceName: deviceInfo.deviceName,
    browser: deviceInfo.browser,
    platform: deviceInfo.platform,
    location: deviceInfo.location,
    requestId: req?.requestId,
    timestamp: new Date().toISOString(),
    logType: "USER_ACTIVITY",
    ...additionalData,
  };

  if (user) {
    logData.userId = user._id?.toString();
    logData.userName = user.name;
    logData.userEmail = user.email;
  }

  // Use the correct logger method - metadata will be merged automatically
  switch (level) {
    case "warn":
      logger.warn(message, logData);
      break;
    case "error":
      logger.error(message, logData);
      break;
    case "info":
      logger.info(message, logData);
      break;
    default:
      logger.log(level, message, logData);
  }
};

// Enhanced request logger with device info
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = uuidv4();
  const userAgent = req.get("User-Agent");
  const ip = req.ip || req.connection.remoteAddress;

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  // Log incoming request with device info
  detectDeviceInfo(userAgent, ip)
    .then((deviceInfo) => {
      logger.http("Incoming Request", {
        requestId,
        method: req.method,
        url: req.url,
        ip: ip,
        userAgent: userAgent,
        deviceType: deviceInfo.device,
        deviceName: deviceInfo.deviceName,
        browser: deviceInfo.browser,
        platform: deviceInfo.platform,
        location: deviceInfo.location,
        contentType: req.get("Content-Type"),
        body: sanitizeData(req.body),
        timestamp: new Date().toISOString(),
        logType: "REQUEST",
      });
    })
    .catch((error) => {
      logger.http("Incoming Request", {
        requestId,
        method: req.method,
        url: req.url,
        ip: ip,
        userAgent: userAgent,
        deviceType: "unknown",
        deviceName: "unknown",
        browser: "unknown",
        platform: "unknown",
        location: `IP: ${ip}`,
        contentType: req.get("Content-Type"),
        body: sanitizeData(req.body),
        timestamp: new Date().toISOString(),
        locationError: error.message,
        logType: "REQUEST",
      });
    });

  res.on("finish", () => {
    const duration = Date.now() - start;
    const loglevel = res.statusCode >= 400 ? "warn" : "http";

    // Log request completion with device context
    detectDeviceInfo(userAgent, ip)
      .then((deviceInfo) => {
        logger.log(loglevel, "Request completed", {
          requestId,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          contentLength: res.get("Content-Length"),
          ip: ip,
          deviceType: deviceInfo.device,
          deviceName: deviceInfo.deviceName,
          browser: deviceInfo.browser,
          platform: deviceInfo.platform,
          location: deviceInfo.location,
          timestamp: new Date().toISOString(),
          logType: "REQUEST_COMPLETE",
        });
      })
      .catch((error) => {
        logger.log(loglevel, "Request completed", {
          requestId,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          contentLength: res.get("Content-Length"),
          ip: ip,
          deviceType: "unknown",
          deviceName: "unknown",
          browser: "unknown",
          platform: "unknown",
          location: `IP: ${ip}`,
          timestamp: new Date().toISOString(),
          logType: "REQUEST_COMPLETE",
        });
      });
  });

  next();
};

const performance = (operation, operationName = "anonymous") => {
  return async (...args) => {
    const start = Date.now();
    const requestId = args[0]?.requestId || "system";
    try {
      const result = await operation(...args);
      const duration = Date.now() - start;

      if (duration > 1000) {
        logger.warn("Slow operation detected", {
          operationName,
          requestId,
          duration: `${duration}ms`,
          logType: "PERFORMANCE",
        });
      }

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error("Operation failed", {
        operation: operationName,
        requestId,
        duration: `${duration}ms`,
        error: error.message,
        stack: error.stack,
        logType: "PERFORMANCE_ERROR",
      });
      throw error;
    }
  };
};

const shutdownLogger = () => {
  return new Promise((resolve) => {
    logger.info("Shutting down logger gracefully...", {
      logType: "SYSTEM",
      shutdownTime: new Date().toISOString(),
    });
    setTimeout(() => {
      logger.info("Logger shutdown complete", {
        logType: "SYSTEM",
      });
      resolve();
    }, 2000);
  });
};

// Initialize CloudWatch on startup
setTimeout(() => {
  initializeCloudWatch().then((success) => {
    if (success) {
      console.log(
        "🎉 CloudWatch logging is now active with full metadata support"
      );
    }
  });
}, 3000);

module.exports = {
  logger,
  auditLog,
  userInfoLog,
  requestLogger,
  performance,
  shutdownLogger,
  sanitizeData,
  detectDeviceInfo,
  initializeCloudWatch,
};
