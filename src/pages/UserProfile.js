import React, { useState, useEffect } from "react";
import "../css/UserProfile.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  //   const handleAddClassClick = () => {
  //     navigate(`/createclass/${username}`);
  //   };

  const handleDashboardOnclick = () => {
    navigate(`/teacherdashboard/${username}`);
  };
  //   const handleClassClick = (classId) => {
  //     navigate(`/teacherclassfiles/${classId}/${username}`);
  //   };

  return (
    <>
      <div className="teacher-dashboard-container">
        <div className="logo-container">
          <img
            src="/images/PenScan_Logo.png"
            alt="Logo"
            className="logo"
            onClick={handleDashboardOnclick}
          />
          <p className="dashboard-text" onClick={handleDashboardOnclick}>
            Dashboard
          </p>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
