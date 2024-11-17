// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { Client } = require("pg");

// Database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Connect to the database
client
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Stop the server on database connection failure
  });

// Middleware
const corsOptions = {
  origin: "http://localhost:5173", // Adjust the origin if needed for Vite frontend
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// Handle preflight requests
app.options("*", cors(corsOptions));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Capstone project API");
});

// Import and mount API routes under /api
const authRoutes = require("./api/auth");
app.use("/api/auth", authRoutes); // Mount auth routes at /api/auth

const usersRoutes = require("./api/users");
app.use("/api/users", usersRoutes); // Mount users routes at /api/users

const reviewsRoutes = require("./api/reviews");
app.use("/api/reviews", reviewsRoutes);

const businessesRoutes = require("./api/businesses");
app.use("/api/businesses", businessesRoutes); // Mount businesses routes at /api/businesses

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err); // Log error details
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
