import React, { useState, useEffect } from "react";
import "../css/UserProfile.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [usertype, setUserType] = useState("");
  const [showPopup, setShowPopup] = useState(false); 

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/getuserdetails?username=${username}`);
        const user = response.data;
        if (user) {
          setFirstName(user.firstname);
          setLastName(user.lastname);
          setUserType(user.userType);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [username]);

  const handleDashboardOnclick = () => {
    if(usertype==="Teacher") {
      navigate(`/teacherdashboard/${username}`);
    } else {
      navigate(`/studentdashboard/${username}`);
    }
  };

  const handleEditClick = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/users/updateuserdetails`, {
        username,
        firstname: firstName,
        lastname: lastName,
      });
      console.log("User details updated", response);
      setShowPopup(true); 
    } catch (error) {
      console.error("Error updating user details", error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false); 
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
          <p className="dashboard-text" onClick={handleDashboardOnclick} style={{fontSize: "15px"}}>
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
          <input
            type="text"
            className="text-box"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <p>Lastname</p>
          <input
            type="text"
            className="text-box"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <button className="edit-button" onClick={handleEditClick}>
          Edit
        </button>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p className="popup-message">User details updated successfully!</p>
            <button className="popup-button" onClick={handleClosePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
