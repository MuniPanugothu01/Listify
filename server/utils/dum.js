require("dotenv").config();
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { v4: uuidv4, stringify } = require("uuid");
const { combine, timestamp, json, errors, metadata } = winston.format;

let CloudWatchTransport;
try {
  CloudWatchTransport = require("winston-cloudwatch");
} catch (error) {
  console.log(
    "cloudwatch transport not installed,Run:npm install winston-cloudwatch"
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

  // redact common sensitive fields
  sensitiveFields.forEach((field) => {
    if (sanitized[field]) sanitized[field] = "***REDACTED***";
    if (sanitized.body && sanitized.body[field]) sanitized.body[field] = "***REDACTED***";
  });

  // redact headers
  if (sanitized.headers) {
    if (sanitized.headers.authorization) sanitized.headers.authorization = "***REDACTED***";
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
  winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
    let log = `${timestamp} [${level}]`;
    if (requestId) log += `[${requestId}]`;
    log += `${message}`;

    if (Object.keys(meta).length > 0) {
      const { timestamp: _, ...cleanMeta } = meta;
      log += `${JSON.stringify(sanitizeData(cleanMeta))}`;
    }
    return log;
  })
);

const logger = winston.createLogger({
  level: level(),
  levels,
  defaultMeta: {
    service: "auth-service",
    environment: process.env.NODE_ENV || "developments",
  },
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "ISO8601" }),
    sanitizeFormat(),
    metadata(),
    json()
  ),
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? winston.format.combine(timestamp(), json())
          : consoleFormat,
    }),

    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "10m",
      maxFiles: "14d",
      zippedArchive: true,
    }),

    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "14d",
      zippedArchive: true,
    }),
  ],
});

const setupCloudWatch = () => {
  if (!CloudWatchTransport || !process.env.AWS_REGION) return null;

  const cloudWatchConfig = {
    logGroupName: process.env.CLOUDWATCH_GROUP || "auth-service",
    logStreamName:
      process.env.CLOUDWATCH_STREAM || `${process.env.NODE_ENV}-${Date.now()}`,

    awsRegion: process.env.AWS_REGION,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    messsageFormat: (log) => {
      return JSON.stringify({
        level: log.level,
        message: log.message,
        timestamp: log.timestamp,
        service: "auth-service",
        environment: process.env.NODE_ENV || "development",
        ...log.metadata,
      });
    },
  };

  const cloudWatchTransport = new CloudWatchTransport(cloudWatchConfig);

  cloudWatchTransport.on("error", (error) => {
    console.error("cloudwatch Transport Error", error);
  });

  cloudWatchTransport.on("success", (response) => {
    logger.debug("log sent to cloudwatch successfully", response);
  });

  return cloudWatchTransport;
};

// add cloudwatch transport in production
if (
  process.env.NODE_ENV === "production" &&
  process.env.ENABLE_CLOUDWATCH === "true"
) {
  const cloudWatchTransport = setupCloudWatch();
  if (cloudWatchTransport) {
    logger.add(cloudWatchTransport);
    logger.info("cloudwatch logging enabled");
  }
}

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = uuidv4();

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  logger.http("Incoming request", {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    contentType: req.get("Content-Type"),
    body: sanitizeData(req.body),
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    const loglevel = res.statusCode >= 400 ? "warn" : "http";
    logger.log(loglevel, "Request completed", {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get("Content-Length"),
      userAgent: req.get("User-Agent"),
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
        logger.warn("slow operation detected", {
          requestId,
          operation: operationName,
          duration: `${duration}ms`,
        });
      }

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error("operation failed", {
        requestId,
        operation: operationName,
        duration: `${duration}ms`,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };
};


const shutdownLogger = () =>{
    return new Promise((resolve)=>{
        logger.info('Shutting down logger gracefully...')
        setTimeout(()=>{
            logger.info('Logger shutdown complete');
            resolve(); 
        })
    },2000)
}


module.exports = {
    logger,requestLogger,performance,shutdownLogger,sanitizeData
}