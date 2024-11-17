const { client } = require("./client");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT || "shhh";

// Create a new user
const createUser = async ({ username, password }) => {
  if (!username || !password) {
    const error = new Error("Username and password are required!");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
  `;
  const values = [uuid.v4(), username, hashedPassword];
  const { rows } = await client.query(SQL, values);
  return rows[0];
};

// Authenticate user and generate JWT token
const authenticate = async ({ username, password }) => {
  const SQL = `SELECT id, username, password FROM users WHERE username = $1`;
  const { rows } = await client.query(SQL, [username]);

  // Check if user exists and the password matches
  if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) {
    const error = new Error("Not authorized");
    error.status = 401;
    throw error;
  }

  // Generate token
  const token = jwt.sign({ id: rows[0].id }, JWT_SECRET);
  return { token };
};

// Find user by token
const findUserWithToken = async (userId) => {
  const SQL = `SELECT id, username FROM users WHERE id = $1`;
  const { rows } = await client.query(SQL, [userId]);

  if (!rows.length) {
    throw new Error("User not found");
  }

  return rows[0];
};

  const fetchUsers = async () => {
    const SQL = `SELECT id, username FROM users`;
    const { rows } = await client.query(SQL);
    return rows;
  };

module.exports = { createUser, authenticate, findUserWithToken ,fetchUsers };
