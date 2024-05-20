import React, { useState, useEffect } from "react";
import "../css/TeacherDashboard.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TeacherClassFiles = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { classid } = useParams();
  const [userId, setUserId] = useState(null);
  const [userClasses, setUserClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("Class Files");

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

  const handleAddClick = () => {
    if (activeTab === "Class Files") {
      alert("Add Files Clicked");
    } else if (activeTab === "Students") {
      navigate(`/addstudent/${classid}/${username}`);
    }
  };

  const handleDashboardOnclick = () => {
    navigate(`/teacherdashboard/${username}`);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
        <p className="classes-text-container">
          <button className="create-class-button"
            style={{
              backgroundColor: activeTab === "Class Files" ? "#002C66" : "lightgray",
              color: activeTab === "Class Files" ? "white" : "black",
              borderRadius:0
            }}
            onClick={() => handleTabClick("Class Files")}
          >
            Class Files
          </button>
          <button className="create-class-button"
            style={{
              backgroundColor: activeTab === "Students" ? "#002C66" : "lightgray",
              color: activeTab === "Students" ? "white" : "black",
              borderRadius:0
            }}
            onClick={() => handleTabClick("Students")}
          >
            Students
          </button>
        </p>
        <button
          className="create-class-button"
          onClick={handleAddClick}
        >
          {activeTab === "Class Files" ? "Add Files" : "Add Student"}
        </button>
      </div>
      {/* <div className="class-names-container">
        {userClasses.map((classData, index) => (
          <div className="class-name" key={index}>
            <div className="class-square">{classData.classname}</div>
          </div>
        ))}
      </div> */}
    </>
  );
};

export default TeacherClassFiles;
