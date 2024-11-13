const { client } = require("./client");
const uuid = require("uuid");
const createBusiness = async ({
  businessname_full,
  street_address,
  city,
  state,
  zip,
  price_range,
}) => {
  if (!businessname_full) {
    const error = Error("Please provide full business name!");
    error.status = 401;
    throw error;
  }
  console.log("Creating business and populating data.", {
    businessname_full,
    street_address,
    city,
    state,
    zip,
    price_range,
  });
  const SQL = `
    INSERT INTO businesses(id, businessname_full, street_address, city, state, zip, price_range)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    businessname_full,
    street_address,
    city,
    state,
    zip,
    price_range,
  ]);
  return response.rows[0];
};
const fetchBusinesses = async () => {
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
  const response = await client.query(SQL);
  return response.rows;
};
const fetchBusiness = async (id) => {
  const SQL = `
    SELECT
      b.*,
      COUNT(r.id) AS review_count,
      AVG(r.rating) AS review_avgrating
    FROM businesses b
    LEFT JOIN reviews r ON b.id = r.business_id
    WHERE b.id = $1  -- 'b.id' for businesses table
    GROUP BY b.id;
  `;
  const {
    rows: [business],
  } = await client.query(SQL, [id]);
  console.log("Fetched Business:", business);
  return business;
};
module.exports = { createBusiness, fetchBusinesses, fetchBusiness };
