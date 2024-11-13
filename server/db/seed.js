const { client } = require("./client");
const uuid = require("uuid");
const {
  createUser,
  fetchUsers,
  createBusiness,
  fetchBusinesses,
  createReview,
  fetchReviews,
} = require("./index.js");

const { createUser, fetchUsers } = require("./index.js");

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS businesses CASCADE;
    DROP TABLE IF EXISTS reviews CASCADE;
    
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      "isAdmin" BOOLEAN DEFAULT FALSE
    );
    CREATE TABLE businesses(
      id UUID PRIMARY KEY,
      businessname_full VARCHAR(255) NOT NULL,
      street_address VARCHAR(255) NOT NULL,
      city VARCHAR(64) NOT NULL,
      state VARCHAR(64) NOT NULL,
      zip VARCHAR(64) NOT NULL,
      price_range VARCHAR(5) CHECK (price_range IN ('$','$$','$$$','$$$$'))
    );
    CREATE TABLE reviews(
      id UUID PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description VARCHAR(1056) NOT NULL,
      user_id UUID REFERENCES users(id),
      business_id UUID REFERENCES businesses(id),
      rating INT CHECK (rating >= 1 AND rating <= 5),
      UNIQUE (user_id, business_id)
    );
  `;
  await client.query(SQL);
};

const init = async () => {
  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected to the database");
    await createTables();
    console.log("Tables created");
    const users = await Promise.all([
      createUser({ username: "moe", password: "m_pw" }),
      createUser({ username: "lucy", password: "l_pw" }),
      createUser({ username: "ethyl", password: "e_pw" }),
      createUser({ username: "curly", password: "c_pw" }),
      createUser({ username: "adam", password: "a_pw" }),
      createUser({ username: "henry", password: "h_pw" }),
      createUser({ username: "derek", password: "d_pw" }),
      createUser({ username: "smith", password: "s_pw" }),
    ]);

    const usersMap = users.reduce((acc, { user }) => {
      acc[user.username] = user;
      return acc;
    }, {});

    console.log("Users created:", await fetchUsers());

    const businesses = await Promise.all([
      createBusiness({
        businessname_full: "Bryan's Business World",
        street_address: "1545 Zenobis Street",
        city: "Denver",
        state: "Colorado",
        zip: "80505",
        price_range: "$$$",
      }),
      createBusiness({
        businessname_full: "Business Enterprise Institute",
        street_address: "3461 Ringsby Ct",
        city: "Denver",
        state: "Colorado",
        zip: "80505",
        price_range: "$",
      }),
      createBusiness({
        businessname_full: "RevGen Psartners",
        street_address: "1331 17th st",
        city: "Denver",
        state: "Colorado",
        zip: "80505",
        price_range: "$$",
      }),
      createBusiness({
        businessname_full: "Choise Business Oppertunities, LTD",
        street_address: "1338 Greenwood Village",
        city: "Denver",
        state: "Colorado",
        zip: "80505",
        price_range: "$$$",
      }),
    ]);

    console.log("Businesses created:", await fetchBusinesses());
    await Promise.all([
      createReview({
        title: "Title of the Review goes here 1",
        description: "Description text goes here 1",
        user_id: usersMap.moe.id,
        business_id: businesses[0].id,
        rating: 4,
      }),
      createReview({
        title: "Title of the Review goes here 2",
        description: "Description text goes here 2",
        user_id: usersMap.lucy.id,
        business_id: businesses[1].id,
        rating: 3,
      }),
      createReview({
        title: "Title of the Review goes here 3",
        description: "Description text goes here 3",
        user_id: usersMap.ethyl.id,
        business_id: businesses[2].id,
        rating: 2,
      }),
      createReview({
        title: "Title of the Review goes here 3",
        description: "Description text goes here 3",
        user_id: usersMap.curly.id,
        business_id: businesses[3].id,
        rating: 3,
      }),
    ]);

    console.log("Reviews created:", await fetchReviews());
    client.end();
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};
init();
