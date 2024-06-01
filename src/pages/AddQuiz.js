import React, { useState, useEffect } from "react";
import "../css/AddQuiz.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddQuiz = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { classid } = useParams();
  const [userId, setUserId] = useState(null);
  const [quizName, setQuizName] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleQuizNameChange = (event) => {
    setQuizName(event.target.value);
  };

  const handleCorrectAnswerChange = (event) => {
    setCorrectAnswer(event.target.value);
  };

  const handleDashboardOnclick = () => {
    navigate(`/teacherdashboard/${username}`);
  };

  const handleAddQuiz = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/quiz/addquiz",
        {
          classid: classid,
          quizname: quizName,
          teacherid: userId,
          quizanswerkey: correctAnswer
        }
      );
      console.log("Quiz added:", response.data);
      navigate(`/teacherclassfiles/${classid}/${username}`);
    } catch (error) {
      console.error("Error adding quiz:", error);
      setErrorMessage("Error adding quiz. Please try again.");
    }
  };

  const handleCloseError = () => {
    setErrorMessage("");
  };

  return (
    <>
      <div className="addstudent-dashboard-container">
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
      <div className="addstudent-container">
        <p className="addstudent-text">Add Quiz</p>
      </div>
      <div className="input-container">
        <input
          type="text"
          className="class-name-input"
          placeholder="Enter Quiz Name"
          value={quizName}
          onChange={handleQuizNameChange}
        />
        <textarea
          className="addstudent-input-big"
          placeholder="Enter Correct Answer"
          value={correctAnswer}
          onChange={handleCorrectAnswerChange}
        />
        <button className="addstudent-button" onClick={handleAddQuiz}>
          ADD
        </button>
        {errorMessage && (
          <div className="popup">
            <div className="popup-content">
              <p className="error-message">{errorMessage}</p>
              <button className="ok-button" onClick={handleCloseError}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddQuiz;
