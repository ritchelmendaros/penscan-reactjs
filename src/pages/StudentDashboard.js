import React, { useState, useEffect } from "react";
import "../css/StudentDashboard.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [userId, setUserId] = useState(null);
  const [userClasses, setUserClasses] = useState([]);

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

  useEffect(() => {
    const fetchUserClassIds = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/students/getclassidsbyuserid?userid=${userId}`
        );
        const classIds = response.data;
        if (classIds.length > 0) {
          const response = await axios.get(
            `http://localhost:8080/api/classes/getclassdetails?classids=${classIds.join(",")}`
          );
          setUserClasses(response.data);
        }
      } catch (error) {
        console.error("Error fetching user classes:", error);
      }
    };

    if (userId) {
      fetchUserClassIds();
    }
  }, [userId]);

  const handleDashboardOnclick = () => {
    navigate(`/studentdashboard/${username}`);
  };

  const handleUserProfileClick = (classId) => {
    navigate(`/userprofile/${username}`);
  };

  return (
    <>
      <div className="student-dashboard-container">
        <div className="logo-container">
          <img src="/images/PenScan_Logo.png" alt="Logo" className="logo" onClick={handleDashboardOnclick} />
          <p className="dashboard-text" onClick={handleDashboardOnclick} style={{fontSize: "15px"}}>Dashboard</p>
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
      <div className="classes-container">
        <p className="classes-text" style={{backgroundColor: "transparent", marginLeft: "-15px"}}>Classes</p>
      </div>
      <div className="class-names-container">
        {userClasses.map((classData, index) => (
          <div className="class-name" key={index}>
            <div className="class-square">{classData.classname}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StudentDashboard;
