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
  const [studentUsername, setStudentUsername] = useState("");
  const [studentuserId, setStudentUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [allStudents, setAllStudents] = useState([]);

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

    const fetchAllStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/users/getallstudents"
        );
        setAllStudents(response.data);
      } catch (error) {
        console.error("Error fetching all students:", error);
      }
    };

    fetchUserId();
    fetchAllStudents();
  }, [username]);

  useEffect(() => {
    if (studentUsername) {
      fetchStudentIdByUsername(studentUsername);
    }
  }, [studentUsername]);

  const fetchStudentIdByUsername = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/getuserid?username=${username}`
      );
      setStudentUserId(response.data);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

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
    // Add your logic to handle quiz creation here
    // Include the quizName, correctAnswer, and any other necessary data
    // You can use the axios library to make requests to your backend API
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
  className="addstudent-input-big" // Changed to textarea
  placeholder="Enter Correct Answer"
  value={correctAnswer}
  onChange={handleCorrectAnswerChange}
/>

        <datalist id="students">
          {allStudents.map((student) => (
            <option
              key={student.userid}
              value={`${student.firstname} ${student.lastname}`}
            />
          ))}
        </datalist>
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
