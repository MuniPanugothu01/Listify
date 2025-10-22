const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

exports.generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short-lived
  );

  const refreshToken = jwt.sign(
    { id: user._id, tokenId: uuidv4() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // long-lived
  );

  return { accessToken, refreshToken };
};
