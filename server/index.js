const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { client } = require("./db"); // Make sure your db client is properly exported
// Connect to the database
client
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Ensure the server stops on database connection failure
  });
// Middleware
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON requests
// Handle preflight requests
app.options("*", cors(corsOptions));
// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Capstone project API");
});
// GET Route
app.get("/api/auth/me", (req, res) => {
  // Implement your logic here
  res.json({ message: "GET request to /api/auth/me" });
});
// Routes
app.use("/api", require("./api")); // Import and mount API routes under /api
// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err); // Log the error details to the console
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
