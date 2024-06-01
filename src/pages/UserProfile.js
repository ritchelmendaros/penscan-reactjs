import React, { useState, useEffect } from "react";
import "../css/UserProfile.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/getuserdetails?username=${username}`);
        const user = response.data;
        if (user) {
          setFirstName(user.firstname);
          setLastName(user.lastname);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [username]);

  const handleDashboardOnclick = () => {
    navigate(`/teacherdashboard/${username}`);
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
          <p className="dashboard-text" onClick={handleDashboardOnclick}>
            Dashboard
          </p>
        </div>
      </div>
      <div className="profile-container">
        <img
          src="/images/UserIcon.png"
          alt="Profile"
          className="profile-image"
        />
        <div className="text-box-container">
          <p>Firstname</p>
          <input type="text" className="text-box" value={firstName} readOnly />
          <p>Lastname</p>
          <input type="text" className="text-box" value={lastName} readOnly />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
