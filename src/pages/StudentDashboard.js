import React from "react";
import "../css/StudentDashboard.css"; 

const StudentDashboard = () => {

  return (
    <>
    <div className="student-dashboard-container">
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
  </div>
  </>
  );
}

export default StudentDashboard;
