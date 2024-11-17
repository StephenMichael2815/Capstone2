const { client } = require("./client");
const uuid = require("uuid");
const createError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};
const createReview = async ({
  title,
  description,
  user_id,
  business_id,
  rating,
}) => {
  console.log("Creating review with data:", {
    title,
    description,
    user_id,
    business_id,
    rating,
  }); // Add this line
  if (!title || !rating || !description || !business_id || !user_id) {
    createError("All fields required!", 401);
  }
  const checkForReview = `
    SELECT * FROM reviews WHERE user_id = $1 AND business_id = $2;
  `;
  const checkResponse = await client.query(checkForReview, [
    user_id,
    business_id,
  ]);
  if (checkResponse.rows.length > 0) {
    createError("You have already reviewed this business.", 400);
  }
  const SQL = `
    INSERT INTO reviews(id, title, description, user_id, business_id, rating)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    title,
    description,
    user_id,
    business_id,
    rating,
  ]);
  return response.rows[0];
};
const fetchReviews = async () => {
  const SQL = `
    SELECT reviews.id, reviews.title, reviews.description, reviews.user_id, reviews.business_id, reviews.rating, users.username
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    LIMIT 100;
  `;
  const response = await client.query(SQL);
  return response.rows;
};
const getUsersReviews = async (user_id) => {
  try {
    const SQL = `
      SELECT
        reviews.id AS review_id,
        reviews.title,
        reviews.description,
        reviews.rating,
        users.username,
        businesses.businessname_full AS business_name
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      JOIN businesses ON reviews.business_id = businesses.id
      WHERE users.id = $1;
    `;
    const { rows } = await client.query(SQL, [user_id]);
    return rows;
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    throw err;
  }
};

const getBusinessReviews = async (business_id) => {
  try {
    const SQL = `
      SELECT reviews.id, reviews.title, reviews.description, reviews.rating, reviews.user_id, users.username
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      WHERE reviews.business_id = $1;
    `;
    const { rows } = await client.query(SQL, [business_id]);
    return rows;
  } catch (err) {
    throw err;
  }
};
const editReview = async ({ review_id, description, rating }) => {
  if (!review_id || !description || !rating) {
    createError("All fields required!", 401);
  }
  const SQL = `
    UPDATE reviews
    SET description = $1, rating = $2
    WHERE id = $3
    RETURNING *;
  `;
  const { rows } = await client.query(SQL, [description, rating, review_id]);
  if (rows.length === 0) {
    createError("No review found.", 404);
  }
  return rows[0];
};
const deleteReview = async (review_id) => {
  if (!review_id) {
    createError("Must input ID!", 401);
  }
  const SQL = `
    DELETE FROM reviews
    WHERE id = $1
    RETURNING *;
  `;
  const { rows } = await client.query(SQL, [review_id]);
  if (rows.length === 0) {
    createError("No review found", 404);
  }
  return rows[0];
};
module.exports = {
  createReview,
  fetchReviews,
  getUsersReviews,
  getBusinessReviews,
  editReview,
  deleteReview,
};
