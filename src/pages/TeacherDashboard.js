import React from "react";
import "../css/TeacherDashboard.css"; 
import { useNavigate, useParams } from "react-router-dom";

const TeacherDashboard = () => {

  const navigate = useNavigate();
  const { username } = useParams();

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
