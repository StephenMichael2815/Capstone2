import React from "react";
import { Link } from "react-router-dom";

const Home = ({ auth, authAction, logout, businesses, users, reviews }) => {
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = reviews.length ? (totalRating / reviews.length).toFixed(1) : "N/A";

  const topBusiness = businesses.reduce((best, business) => {
    const bestRating = best.review_avgrating ? parseFloat(best.review_avgrating) : 0;
    const currentRating = business.review_avgrating ? parseFloat(business.review_avgrating) : 0;
    return currentRating > bestRating ? business : best;
  }, {});

  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
  };

  const sectionStyle = {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const headingStyle = {
    color: "#333",
    fontSize: "2em",
    marginBottom: "10px",
    textAlign: "center",
  };

  const subheadingStyle = {
    color: "#555",
    fontSize: "1.5em",
    marginBottom: "10px",
  };

  const linkStyle = {
    color: "#007bff",
    textDecoration: "none",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "1em",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome to Acme Business Reviews</h1>

      <section style={sectionStyle}>
        <h2 style={subheadingStyle}>Overview</h2>
        <p>
          Our platform connects you with information about {businesses.length} businesses, shared by {users.length} users 
          through {reviews.length} reviews.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subheadingStyle}>Business Highlights</h2>
        {businesses.length > 0 ? (
          <>
            <p>
              <strong>Top-Rated Business:</strong> {topBusiness.businessname_full || "N/A"} with an average rating of{" "}
              {topBusiness.review_avgrating || "N/A"}.
            </p>
            <p>
              <strong>Overall Average Rating:</strong> {averageRating}
            </p>
          </>
        ) : (
          <p>No businesses available to display.</p>
        )}
      </section>

      <section style={sectionStyle}>
        <h2 style={subheadingStyle}>Users</h2>
        {users.length > 0 ? (
          <p>
            Our community is growing! We have {users.length} registered users sharing their experiences and ratings.
          </p>
        ) : (
          <p>No users have registered yet.</p>
        )}
        {!auth.id && (
          <p>
            <Link to="/register" style={linkStyle}>Register</Link> to become a part of our community, or <Link to="/login" style={linkStyle}>Login</Link> if you're already a member.
          </p>
        )}
      </section>

      <section style={sectionStyle}>
        <h2 style={subheadingStyle}>Reviews</h2>
        {reviews.length > 0 ? (
          <p>
            So far, {reviews.length} reviews have been posted, helping users make informed decisions about businesses in their area.
          </p>
        ) : (
          <p>No reviews have been posted yet. Be the first to <Link to="/createReview" style={linkStyle}>write a review</Link>!</p>
        )}
      </section>

      {auth.id && (
        <section style={sectionStyle}>
          <h2 style={subheadingStyle}>Welcome Back, {auth.username}!</h2>
          <p>
            You are logged in as <strong>{auth.username}</strong>. You can <Link to="/createReview" style={linkStyle}>create a review</Link> or{" "}
            <button onClick={logout} style={buttonStyle}>Logout</button>.
          </p>
        </section>
      )}
    </div>
  );
};

export default Home;
