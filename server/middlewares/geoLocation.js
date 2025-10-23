const geoip = require("geoip-lite");

const geoLocationMiddleware = (req, res, next) => {
  try {
    // Get IP from various sources (behind proxy support)
    let ip =
      req.ip ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["x-real-ip"] ||
      req.headers["x-client-ip"];

    // Clean IP address
    ip = cleanIPAddress(ip);

    // Get geo information
    const geoInfo = getGeoInfo(ip);

    // Enhanced device info
    const userAgent = req.headers["user-agent"] || "unknown";
    const deviceInfo = getBasicDeviceInfo(userAgent);

    // Attach comprehensive info to request object
    req.geoLocation = {
      ...geoInfo,
      ...deviceInfo,
      userAgent: userAgent.substring(0, 500), // Truncate long user agents
    };

    // Simplified location for easy access
    req.clientLocation = geoInfo.location;
    req.clientIP = ip;
  } catch (error) {
    console.error("GeoLocation middleware error:", error.message);
    req.geoLocation = {
      ip: req.ip || "unknown",
      location: "error",
      error: error.message,
      isInternal: false,
      deviceType: "unknown",
      browser: "unknown",
      platform: "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
    };
    req.clientLocation = "error";
    req.clientIP = req.ip || "unknown";
  }

  next();
};

const cleanIPAddress = (ip) => {
  if (!ip) return "unknown";

  // Handle IPv6 mapped IPv4 addresses
  if (ip.includes("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  // Handle multiple IPs in x-forwarded-for
  if (ip.includes(",")) {
    return ip.split(",")[0].trim();
  }

  return ip;
};

const getGeoInfo = (ip) => {
  // Check for internal IPs
  if (isInternalIP(ip)) {
    return {
      ip: ip,
      location: "localhost/internal",
      country: null,
      region: null,
      city: null,
      timezone: null,
      coordinates: null,
      isp: "internal",
      organization: "internal",
      isInternal: true,
    };
  }

  const geo = geoip.lookup(ip);

  if (!geo) {
    return {
      ip: ip,
      location: "unknown",
      country: null,
      region: null,
      city: null,
      timezone: null,
      coordinates: null,
      isp: "unknown",
      organization: "unknown",
      isInternal: false,
      unknownReason: "IP not found in database",
    };
  }

  return {
    ip: ip,
    location: formatLocation(geo),
    country: geo.country,
    countryCode: geo.country,
    region: geo.region,
    city: geo.city,
    timezone: geo.timezone,
    coordinates: geo.ll
      ? {
          latitude: geo.ll[0],
          longitude: geo.ll[1],
        }
      : null,
    metro: geo.metro,
    range: geo.range,
    isp: "unknown",
    organization: "unknown",
    isInternal: false,
  };
};

const getBasicDeviceInfo = (userAgent) => {
  if (!userAgent) {
    return {
      deviceType: "unknown",
      browser: "unknown",
      platform: "unknown",
      deviceName: "unknown",
    };
  }

  let deviceType = "desktop";
  let browser = "unknown";
  let platform = "unknown";
  let deviceName = "Desktop Computer";

  // Device detection
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    deviceType = "mobile";
    if (/iPhone/.test(userAgent)) deviceName = "iPhone";
    else if (/iPad/.test(userAgent)) deviceName = "iPad";
    else if (/Android/.test(userAgent)) deviceName = "Android Mobile";
    else if (/iPod/.test(userAgent)) deviceName = "iPod Touch";
  } else if (/Tablet|iPad/i.test(userAgent)) {
    deviceType = "tablet";
    deviceName = /iPad/.test(userAgent) ? "iPad" : "Android Tablet";
  }

  // Browser detection
  if (/PostmanRuntime/i.test(userAgent)) {
    browser = "Postman";
  } else if (/Chrome\/\d+/.test(userAgent) && !/Edg\/\d+/.test(userAgent)) {
    browser = "Chrome";
  } else if (/Firefox\/\d+/.test(userAgent)) {
    browser = "Firefox";
  } else if (/Safari\/\d+/.test(userAgent) && !/Chrome\/\d+/.test(userAgent)) {
    browser = "Safari";
  } else if (/Edg\/\d+/.test(userAgent)) {
    browser = "Edge";
  } else if (/OPR\/\d+/.test(userAgent)) {
    browser = "Opera";
  }

  // Platform detection
  if (/Windows/.test(userAgent)) {
    platform = "Windows";
  } else if (/Mac OS/.test(userAgent)) {
    platform = "macOS";
  } else if (/Linux/.test(userAgent)) {
    platform = "Linux";
  } else if (/Android/.test(userAgent)) {
    platform = "Android";
  } else if (/iOS|iPhone|iPad|iPod/.test(userAgent)) {
    platform = "iOS";
  }

  return {
    deviceType,
    browser,
    platform,
    deviceName,
  };
};

const isInternalIP = (ip) => {
  if (!ip || ip === "unknown") return true;

  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.20.") ||
    ip.startsWith("172.21.") ||
    ip.startsWith("172.22.") ||
    ip.startsWith("172.23.") ||
    ip.startsWith("172.24.") ||
    ip.startsWith("172.25.") ||
    ip.startsWith("172.26.") ||
    ip.startsWith("172.27.") ||
    ip.startsWith("172.28.") ||
    ip.startsWith("172.29.") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip.startsWith("fc00:") ||
    ip.startsWith("fe80:") ||
    ip === "localhost"
  );
};

const formatLocation = (geo) => {
  const locationParts = [];
  if (geo.city) locationParts.push(geo.city);
  if (geo.region) locationParts.push(geo.region);
  if (geo.country) locationParts.push(geo.country);

  return locationParts.length > 0
    ? locationParts.join(", ")
    : "Unknown location";
};

module.exports = {
  geoLocationMiddleware,
};
