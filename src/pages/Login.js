import React, { useState } from "react";
import axios from "axios"; // Import Axios
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate(); // Use navigate hook

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          username: username,
          password: password, 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login successful:", loginResponse.data);

      navigate(`/teacherdashboard`);
      
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login unsuccessful!");
    }
  };

  return (
    <div className="login-container">
      <div className="content">
        <img src="/images/PenScan_Logo.png" alt="Logo" className="logo" />
        <h2 className="login-text">LOGIN</h2>
        <div className="input-container">
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="register-text">
            Doesn't have an account? <a href="/register">Register</a>
          </p>
          {error && <p className="error-message">{error}</p>}
          <button className="login-button" onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
