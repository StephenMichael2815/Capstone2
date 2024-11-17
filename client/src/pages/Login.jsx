import React, { useState } from "react";
import AuthForm from "../components/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = ({ authAction }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleAuthAction = async (data) => {
    try {
      await authAction(data, "login");
      navigate("/");
    } catch (error) {
      setError("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome Back!</h1>
      <AuthForm authAction={handleAuthAction} mode="login" />
      {error && <div className="error-message">{error}</div>}
      <Link to="/register" className="register-link">
        Click here to register
      </Link>
    </div>
  );
};

export default Login;
