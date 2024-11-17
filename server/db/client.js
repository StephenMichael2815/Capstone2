require("dotenv").config();
console.log("Database URL:", process.env.DATABASE_URL); // For debugging

const { Pool } = require("pg");

const client = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

module.exports = { client };
