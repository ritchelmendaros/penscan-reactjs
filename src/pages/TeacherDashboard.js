import React, { useState, useEffect } from "react";
import "../css/TeacherDashboard.css"; 
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TeacherDashboard = () => {

  const navigate = useNavigate();
  const { username } = useParams();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/getuserid?username=${username}`);
        setUserId(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [username]);

  const handleAddClassClick = () => {
    navigate(`/createclass/${username}`);
  };


  return (
    <>
    <div className="teacher-dashboard-container">
      <div className="logo-container">
        <img src="/images/PenScan_Logo.png" alt="Logo" className="logo" />
        <p className="dashboard-text">Dashboard</p>
      </div>
      <div className="action-container">
        <div className="user-icon-container">
          <img src="/images/UserIcon.png" alt="User Icon" className="user-icon" />
        </div>
      </div>
    </div>
    <div className="classes-container">
    <p className="classes-text">Classes</p>
    <img src="/images/AddIcon.png" alt="Plus Icon" className="plus-icon" onClick={handleAddClassClick}/>
  </div>
  </>
  );
}

export default TeacherDashboard;
