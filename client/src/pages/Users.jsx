import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Users</h1>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} style={styles.userCard}>
            <h2 style={styles.userName}>
              <Link to={`/users/${user.id}`} style={styles.link}>
                {user.username}
              </Link>
            </h2>
          </div>
        ))
      ) : (
        <p style={styles.noUsers}>No users found.</p>
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
  userCard: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  userName: {
    fontSize: "1.8em",
    color: "#333",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
  noUsers: {
    fontSize: "1.2em",
    color: "#888",
    textAlign: "center",
  },
};

export default Users;
