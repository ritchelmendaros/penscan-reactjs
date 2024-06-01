import React, { useState, useEffect } from "react";
import "../css/TeacherClassFiles.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TeacherClassFiles = () => {
  const navigate = useNavigate();
  const { username, classid } = useParams();
  const [userId, setUserId] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState("Class Files");

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
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/quiz/getquizbyteacherid?teacherid=${userId}&classid=${classid}`
        );
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    if (userId && classid) {
      fetchQuizzes();
    }
  }, [userId, classid]);

  const handleAddClick = () => {
    if (activeTab === "Class Files") {
      navigate(`/addquiz/${classid}/${username}`);
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

  const handleQuizClick = (quiz) => {
    navigate(`/addfiles/${classid}/${userId}/${quiz.quizid}`);
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
          <button
            className="create-class-button"
            style={{
              backgroundColor:
                activeTab === "Class Files" ? "#002C66" : "lightgray",
              color: activeTab === "Class Files" ? "white" : "black",
              borderRadius: 0,
            }}
            onClick={() => handleTabClick("Class Files")}
          >
            Class Files
          </button>
          <button
            className="create-class-button"
            style={{
              backgroundColor:
                activeTab === "Students" ? "#002C66" : "lightgray",
              color: activeTab === "Students" ? "white" : "black",
              borderRadius: 0,
            }}
            onClick={() => handleTabClick("Students")}
          >
            Students
          </button>
        </p>
        <button className="create-class-button" onClick={handleAddClick}>
          {activeTab === "Class Files" ? "Add Quiz" : "Add Student"}
        </button>
      </div>
      {activeTab === "Class Files" && (
        <div className="class-names-container">
          {quizzes.map((quiz, index) => (
            <div className="class-name" key={index}>
              <div
                className="class-square"
                onClick={() => handleQuizClick(quiz)}
              >
                {quiz.quizname}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TeacherClassFiles;
