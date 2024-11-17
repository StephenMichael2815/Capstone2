const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { authenticate, createUser, findUserWithToken } = require("../db");
const { isLoggedIn } = require("./utils");

// Test route
router.get("/", (req, res) => {
  res.send("hello from auth");
});

// Login endpoint
router.post("/login", async (req, res, next) => {
  try {
    const token = await authenticate(req.body);
    res.send(token); // Send back the token object directly
  } catch (error) {
    next(error);
  }
});

// Register endpoint
router.post("/register", async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    const token = jwt.sign({ id: user.id }, process.env.JWT || "shhh");
    res.status(201).json({ message: "Registration successful. Please log in." });
  } catch (error) {
    next(error);
  }
});

// Get current user (Protected route)
router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    res.send(req.user); // `req.user` is set by `isLoggedIn` middleware
  } catch (error) {
    next(error);
  }
});

module.exports = router;
