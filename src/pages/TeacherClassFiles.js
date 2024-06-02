import React, { useState, useEffect } from "react";
import "../css/TeacherClassFiles.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TeacherClassFiles = () => {
  const navigate = useNavigate();
  const { username, classid } = useParams();
  const [userId, setUserId] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

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

  const handleAddQuizClick = () => {
    navigate(`/addquiz/${classid}/${username}`);
  };

  const handleAddStudentClick = () => {
    navigate(`/addstudent/${classid}/${username}`);
  };

  const handleDashboardOnclick = () => {
    navigate(`/teacherdashboard/${username}`);
  };

  const handleQuizClick = (quiz) => {
    navigate(`/addfiles/${classid}/${username}/${userId}/${quiz.quizid}`);
  };

  const handleUserProfileClick = (classId) => {
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
          <p className="dashboard-text" onClick={handleDashboardOnclick} style={{fontSize: "15px"}}>
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
      <div className="classes-container">
        <p className="classes-text-container">
            Class Files
        </p>
        <div className="teacherfiles-buttons-container">
          <button className="create-class-button" onClick={handleAddQuizClick}>
            Add Quiz
          </button>
          <button className="create-class-button" onClick={handleAddStudentClick}>
            Add Student
          </button>
        </div>
      </div>
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
    </>
  );
};

export default TeacherClassFiles;
