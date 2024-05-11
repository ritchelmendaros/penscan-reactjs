import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/register",
        {
          firstname,
          lastname,
          username,
          password,
          userType,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration unsuccessful!");
    }
  };

  return (
    <div className="signup-container">
      <div className="content">
        <img src="/images/PenScan_Logo.png" alt="Logo" className="logo" />
        <h2 className="signup-text">SIGN UP</h2>
        <p className="register-text">
          Already have an account? <a href="/login">Login</a>
        </p>
        <div className="input-container">
          <input
            type="text"
            placeholder="First Name"
            className="input-field"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="input-field"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
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
          <div className="radio-container">
            <input
              type="radio"
              name="userType"
              value="Student"
              className="radio-input"
              checked={userType === "Student"}
              onChange={() => setUserType("Student")}
            />
            <label className="radio-label">Student</label>
            <input
              type="radio"
              name="userType"
              value="Teacher"
              className="radio-input"
              checked={userType === "Teacher"}
              onChange={() => setUserType("Teacher")}
            />
            <label className="radio-label">Teacher</label>
          </div>
          <button className="signup-button" onClick={handleSignUp}>
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
