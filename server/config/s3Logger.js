// server/config/s3Logger.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;
if (!BUCKET) throw new Error("❌ Missing AWS_S3_BUCKET in .env");

exports.logToS3 = async (eventType, data = {}) => {
  try {
    const date = new Date();
    const datePath = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const logKey = `auth-logs/${datePath}/${eventType}-${uuidv4()}.json`;

    const logData = {
      eventType,
      timestamp: date.toISOString(),
      ...data,
    };

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: logKey,
        Body: JSON.stringify(logData, null, 2),
        ContentType: "application/json",
      })
    );

    // local hint only for dev
    if (process.env.NODE_ENV !== "production") {
      console.log(`✅ Logged ${eventType} to S3: ${logKey}`);
    }
  } catch (err) {
    console.error("❌ S3 log error:", err);
  }
};
