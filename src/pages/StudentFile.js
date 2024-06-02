import React, { useState, useEffect, useRef } from "react";
import "../css/AddFiles.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const StudentFile = () => {
  const navigate = useNavigate();
  const { username, classid } = useParams();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/getuserid?username=${username}`
        );
        setUserId(response.data);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [username]);



  const handleDashboardOnclick = () => {
    navigate(`/teacherdashboard/${username}`);
  };

  const handleUserProfileClick = () => {
    navigate(`/userprofile/${username}`);
  };

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
          <p
            className="dashboard-text"
            onClick={handleDashboardOnclick}
            style={{ fontSize: "15px" }}
          >
            Dashboard
          </p>
        </div>
        <div className="action-container">
          <div className="user-icon-container" onClick={handleUserProfileClick}>
            <img
              src="/images/UserIcon.png"
              alt="User Icon"
              className="user-icon"
            />
          </div>
        </div>
      </div>
      <div className="buttons-container">
        <button style={{backgroundColor: "transparent", marginLeft: "-15px", fontSize: "15px"}}
        >
          Class Files
        </button>
        </div>
    
    </>
  );
};

export default StudentFile;
