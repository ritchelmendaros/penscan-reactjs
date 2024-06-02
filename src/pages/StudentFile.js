import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../css/StudentFile.css";

const StudentFile = () => {
  const navigate = useNavigate();
  const { classid, username } = useParams();
  const [userId, setUserId] = useState(null);
  const [quizNames, setQuizNames] = useState([]);
  const [expandedQuiz, setExpandedQuiz] = useState(null);

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
    const fetchQuizNames = async () => {
      if (userId && classid) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/students/getquizidsandnamesbyuseridandclassid?userid=${userId}&classid=${classid}`
          );
          setQuizNames(response.data);
        } catch (error) {
          console.error("Error fetching quiz names:", error);
        }
      }
    };

    fetchQuizNames();
  }, [userId, classid]);

  const handleDashboardOnclick = () => {
    navigate(`/studentdashboard/${username}`);
  };

  const handleUserProfileClick = () => {
    navigate(`/userprofile/${username}`);
  };

  const toggleExpand = (index) => {
    setExpandedQuiz(expandedQuiz === index ? null : index);
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
          <p
            className="dashboard-text"
            onClick={handleDashboardOnclick}
            style={{ fontSize: "15px" }}
          >
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
      <div className="buttons-container">
        <button
          style={{
            backgroundColor: "transparent",
            marginLeft: "-15px",
            fontSize: "15px",
          }}
        >
          Class Files
        </button>
      </div>
      <div>
        {quizNames.map((quiz, index) => (
          <div
            key={index}
            onClick={() => toggleExpand(index)}
            className="student-name-container"
          >
            <img
              src={
                expandedQuiz === index
                  ? "/images/expand2.png"
                  : "/images/expand1.png"
              }
              alt="Expand"
              className="quizexpand-icon"
            />
            <span className="quiz-name">{quiz.quizName}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default StudentFile;
