-- Drop tables if they already exist to avoid conflicts
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS businesses;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create businesses table
CREATE TABLE businesses (
    id UUID PRIMARY KEY,
    businessname_full VARCHAR(255) NOT NULL,
    street_address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip VARCHAR(20),
    price_range VARCHAR(20)
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);
