import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

      // Fetch user type
      const userTypeResponse = await axios.get(
        `http://localhost:8080/api/users/getusertype?username=${username}`
      );

      const userType = userTypeResponse.data;
      
      // Navigate based on user type
      if (userType === "Student") {
        navigate(`/studentdashboard/${username}`);
      } else if (userType === "Teacher") {
        navigate(`/teacherdashboard/${username}`);
      } else {
        console.log("Unknown user type");
      }
      console.log("Login successful:", loginResponse.data);
      
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Incorrect username or password");
    }
  };

  const handleRegisterClick = () => {
    navigate(`/signup`);
  };

  const handleCloseError = () => {
    setErrorMessage("");
  };

  return (
    <div className="login-container">
      <div className="content">
        <img src="/images/PenScan_Logo.png" alt="Logo" className="logo-login" />
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
            Doesn't have an account?{" "}
            <span className="register-link" onClick={handleRegisterClick}>
              <u>Register</u>
            </span>
          </p>
          <button className="login-button" onClick={handleLogin}>
            LOGIN
          </button>
          {errorMessage && (
            <div className="popup">
              <div className="popup-content">
                <p className="error-message">{errorMessage}</p>
                <button className="ok-button" onClick={handleCloseError}>
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
