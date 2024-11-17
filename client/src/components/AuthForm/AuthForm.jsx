import { useState } from "react";

const AuthForm = ({ authAction, mode = "login" }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (ev) => {
    ev.preventDefault();
    try {
      await authAction({ username, password }, mode);
    } catch (ex) {
      setError("Authentication failed: " + ex.message);
    }
  };

  return (
    <form onSubmit={submit}>
      {error && <div className="error">{error}</div>}
      <input
        value={username}
        placeholder="username"
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="password"
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>{mode === "register" ? "Register" : "Login"}</button>
    </form>
  );
};

export default AuthForm;
