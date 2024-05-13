import React, { useState, useEffect } from "react";
import "../css/TeacherDashboard.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TeacherClassFiles = () => {
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
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [username]);

  useEffect(() => {
    const fetchUserClasses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/classes/getclassesbyteacherid?teacherid=${userId}`
        );
        setUserClasses(response.data);
        console.log("User Classes:", response.data);
      } catch (error) {
        console.error("Error fetching user classes:", error);
      }
    };

    if (userId) {
      fetchUserClasses();
    }
  }, [userId]);

  const handleAddStudentClick = () => {
    navigate(`/addstudent/${username}`);
  };

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
      <div className="classes-container">
        <p className="classes-text">Class Files</p>
        <img
          src="/images/AddIcon.png"
          alt="Plus Icon"
          className="plus-icon"
          onClick={handleAddStudentClick}
        />
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

export default TeacherClassFiles;
