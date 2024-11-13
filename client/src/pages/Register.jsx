import React, { useState } from "react";
import AuthForm from "../components/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Register = ({ authAction }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const handleAuthAction = async (data) => {
    try {
      await authAction(data, "register");
      navigate("/");
    } catch (error) {
      setError("Registration failed: " + error.message);
    }
  };
  return (
    <div>
      <h1>Be our friend!</h1>
      <AuthForm authAction={handleAuthAction} mode="register" />
      {error && <div className="error-message">{error}</div>}
      <Link to="/login">Click here to login</Link>
    </div>
  );
};
export default Register;
