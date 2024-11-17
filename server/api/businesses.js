// Existing imports and setup
const express = require("express");
const router = express.Router();
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

router.use(cors());
router.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Fetch all businesses
router.get("/", async (req, res) => {
  try {
    const SQL = `
      SELECT
        b.*,
        COUNT(r.id) AS review_count,
        CASE
          WHEN COUNT(r.id) = 0 THEN 'N/A'
          ELSE ROUND(AVG(r.rating), 1)::text
        END AS review_avgrating
      FROM businesses b
      LEFT JOIN reviews r ON b.id = r.business_id
      GROUP BY b.id;
    `;
    const result = await pool.query(SQL);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ error: "Failed to fetch businesses" });
  }
});

// New: Fetch a single business by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const SQL = `
      SELECT
        b.*,
        COUNT(r.id) AS review_count,
        CASE
          WHEN COUNT(r.id) = 0 THEN 'N/A'
          ELSE ROUND(AVG(r.rating), 1)::text
        END AS review_avgrating
      FROM businesses b
      LEFT JOIN reviews r ON b.id = r.business_id
      WHERE b.id = $1
      GROUP BY b.id;
    `;
    const result = await pool.query(SQL, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Business not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error fetching business:", error);
    res.status(500).json({ error: "Failed to fetch business" });
  }
});

module.exports = router;
