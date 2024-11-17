import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm/AuthForm";
import { useState } from "react";

const Register = ({ authAction }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleAuthAction = async (data) => {
    try {
      await authAction(data, "register");
      navigate("/login");
    } catch (error) {
      setError("Registration failed: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <h1>Be our friend!</h1>
      <AuthForm authAction={handleAuthAction} mode="register" />
      {error && <div className="error-message">{error}</div>}
      <p>
        Already have an account?{" "}
        <button onClick={() => navigate("/login")} className="login-link">
          Log in here
        </button>
      </p>
    </div>
  );
};

export default Register;
