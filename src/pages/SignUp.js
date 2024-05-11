import React from "react";
import "../css/SignUp.css";

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="content">
        <img src="/images/PenScan_Logo.png" alt="Logo" className="logo" />
        <h2 className="signup-text">SIGN UP</h2>
        <div className="input-container">
          <input type="text" placeholder="First Name" className="input-field" />
          <input type="text" placeholder="Last Name" className="input-field" />
          <input type="text" placeholder="Username" className="input-field" />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
          />
          <div className="radio-container">
            <input
              type="radio"
              name="userType"
              value="student"
              className="radio-input"
            />
            <label className="radio-label">Student</label>
            <input
              type="radio"
              name="userType"
              value="teacher"
              className="radio-input"
            />
            <label className="radio-label">Teacher</label>
          </div>
          <button className="signup-button">SIGN UP</button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
