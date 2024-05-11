import React from "react";
import "../css/Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="content">
        <img src="/images/PenScan_Logo.png" alt="Logo" className="logo" />
        <h2 className="login-text">LOGIN</h2>
        <div className="input-container">
          <input type="text" placeholder="Username" className="input-field" />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
          />
          <p className="register-text">
            Doesn't have an account? <a href="/register">Register</a>
          </p>
          <button className="login-button">LOGIN</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
