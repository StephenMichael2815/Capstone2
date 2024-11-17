import { useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Users from "./pages/Users";
import Businesses from "./pages/Businesses";
import CreateReview from "./pages/CreateReview";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDetail from "./pages/UserDetail";
import BusinessDetail from "./pages/BusinessDetail";

function App() {
  const [auth, setAuth] = useState({});
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    attemptLoginWithToken();
    fetchUsers();
    fetchBusinesses();
  }, []);

  // Attempt login with saved token
 // Inside App.js or App.jsx
const attemptLoginWithToken = async () => {
  const token = window.localStorage.getItem("token");
  console.log("Token being sent:", token); // Log the token before sending

  if (token) {
    const response = await fetch(`http://localhost:3000/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure Bearer prefix is included
      },
    });
    const json = await response.json();
    if (response.ok) {
      setAuth(json); // Set authenticated user
    } else {
      console.log("Token invalid or expired, removing it.");
      window.localStorage.removeItem("token"); // Remove invalid token
    }
  }
};


  // Authentication action for login and register
  const authAction = async (credentials, mode) => {
    const response = await fetch(`http://localhost:3000/api/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const json = await response.json();
    console.log("Login response JSON:", json); // Log the response to verify token
    if (response.ok) {
      console.log("Storing token:", json.token);
      window.localStorage.setItem("token", json.token);
      attemptLoginWithToken();
    } else {
      throw json;
    }
  };
  
  
  // Logout function
  const logout = () => {
    window.localStorage.removeItem("token");
    setAuth({});
  };

  // Fetch users from API
  const fetchUsers = async () => {
    const response = await fetch("http://localhost:3000/api/users");
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  // Fetch businesses from API
  const fetchBusinesses = async () => {
    const response = await fetch("http://localhost:3000/api/businesses");
    if (response.ok) {
      const data = await response.json();
      setBusinesses(data);
    }
  };

  return (
    <>
      <header>
        <h1>Acme Business Reviews</h1>
      </header>
      <nav>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/businesses" className="nav-link">Businesses ({businesses.length})</Link>
        <Link to="/users" className="nav-link">Users ({users.length})</Link>
        {auth.id ? (
          <>
            <Link to="/createReview" className="nav-link">Create Review</Link>
            <button onClick={logout} className="logout-btn">Logout {auth.username}</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              authAction={authAction}
              auth={auth}
              businesses={businesses}
              users={users}
              reviews={reviews}
            />
          }
        />
        <Route
          path="/businesses"
          element={<Businesses businesses={businesses} />}
        />
        <Route
          path="/businesses/:id"
          element={<BusinessDetail auth={auth} />}
        />
        <Route
          path="/users"
          element={<Users users={users} />}
        />
        <Route
          path="/users/:id"
          element={<UserDetail auth={auth} />}
        />
        {!!auth.id && (
          <Route path="/createReview" element={<CreateReview auth={auth} />} />
        )}
        <Route path="/login" element={<Login authAction={authAction} />} />
        <Route path="/register" element={<Register authAction={authAction} />} />
      </Routes>
    </>
  );
}

export default App;
