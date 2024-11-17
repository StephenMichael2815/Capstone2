import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Frontend = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/businesses");
        if (!response.ok) {
          throw new Error(`Failed to fetch businesses: ${response.statusText}`);
        }
        const data = await response.json();
        setBusinesses(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBusinesses();
  }, []);
  
  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Businesses</h1>
      {businesses.length > 0 ? (
        businesses.map((business) => (
          <div key={business.id} style={styles.businessCard}>
            <h2 style={styles.businessName}>
              <Link to={`/businesses/${business.id}`} style={styles.link}>
                {business.businessname_full}
              </Link>
            </h2>
            <p style={styles.info}>
              <strong>Address:</strong> {business.street_address}, {business.city},{" "}
              {business.state} {business.zip}
            </p>
            <p style={styles.info}><strong>Price Range:</strong> {business.price_range}</p>
            <p style={styles.info}><strong>Reviews:</strong> {business.review_count}</p>
            <p style={styles.info}><strong>Average Rating:</strong> {business.review_avgrating}</p>
          </div>
        ))
      ) : (
        <p style={styles.noBusiness}>No businesses found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
  },
  heading: {
    textAlign: "center",
    fontSize: "2.5em",
    color: "#444",
    marginBottom: "20px",
  },
  loading: {
    fontSize: "1.5em",
    color: "#888",
    textAlign: "center",
    marginTop: "20px",
  },
  error: {
    fontSize: "1.5em",
    color: "red",
    textAlign: "center",
    marginTop: "20px",
  },
  businessCard: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  businessName: {
    fontSize: "1.8em",
    color: "#333",
    marginBottom: "10px",
  },
  info: {
    fontSize: "1em",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "8px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
  linkHover: {
    color: "#0056b3",
  },
  noBusiness: {
    fontSize: "1.2em",
    color: "#888",
    textAlign: "center",
  },
};

export default Frontend;
