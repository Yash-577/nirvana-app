import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2 className="auth-title">Welcome Back 🌿</h2>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="auth-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>

        <p className="auth-footer">
          New here?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
