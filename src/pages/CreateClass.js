import React from "react";
import "../css/CreateClass.css";

const CreateClass = () => {
  return (
    <>
      <div className="createclass-dashboard-container">
        <div className="logo-container">
          <img src="/images/PenScan_Logo.png" alt="Logo" className="logo" />
          <p className="dashboard-text">Dashboard</p>
        </div>
        <div className="action-container">
          <div className="user-icon-container">
            <img
              src="/images/UserIcon.png"
              alt="User Icon"
              className="user-icon"
            />
          </div>
        </div>
      </div>
      <div className="createclass-container">
        <p className="createclass-text">Create a Class</p>
      </div>
      <div className="input-container">
        <input
          type="text"
          className="class-name-input"
          placeholder="Enter Class Name"
        />
        <button className="create-class-button">CREATE</button>
      </div>
    </>
  );
};

export default CreateClass;
