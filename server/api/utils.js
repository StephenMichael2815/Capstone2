// server/api/utils.js
const jwt = require("jsonwebtoken");
const { findUserWithToken } = require("../db");

const isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader); // Log the auth header

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT || "shhh"); // Verify JWT token
    console.log("Token payload:", payload); // Log payload for debugging

    req.user = await findUserWithToken(payload.id); // Get user by ID from token payload
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log error details
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { isLoggedIn };
