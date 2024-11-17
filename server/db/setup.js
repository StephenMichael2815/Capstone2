const { client } = require("./client");
const fs = require("fs");
const path = require("path");

const setupDatabase = async () => {
  const sql = fs.readFileSync(path.join(__dirname, "create_tables.sql"), "utf8");

  try {
    await client.query(sql);
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    client.end();
  }
};

setupDatabase();
