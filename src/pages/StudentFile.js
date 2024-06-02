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
  const [quizDetails, setQuizDetails] = useState([]);
  const [answerKey, setAnswerKey] = useState("");

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

  const fetchAnswerKey = async (quizid) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/quiz/getanswerkey?quizid=${quizid}`
      );
      setAnswerKey(response.data);
    } catch (error) {
      console.error("Error fetching answer key:", error);
    }
  };

  const handleDashboardOnclick = () => {
    navigate(`/studentdashboard/${username}`);
  };

  const handleUserProfileClick = () => {
    navigate(`/userprofile/${username}`);
  };

  const toggleExpand = async (index, quizId) => {
    if (expandedQuiz === index) {
      setExpandedQuiz(null);
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/studentquiz/get?studentid=${userId}&quizid=${quizId}`
        );
        setQuizDetails((prevDetails) => ({
          ...prevDetails,
          [index]: response.data,
        }));
        await fetchAnswerKey(quizId);
        setExpandedQuiz(index);
      } catch (error) {
        console.error("Error fetching quiz details:", error);
      }
    }
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
      <div className="quiz-container">
        {quizNames.map((quiz, index) => (
          <div key={index} className="quiz-item">
            <div
              className="name-toggle-container"
              onClick={() => toggleExpand(index, quiz.quizId)}
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
            {expandedQuiz === index && quizDetails[index] && (
              <div className="studentadditional-content">
                <p className="student-score">
                    <span>Score:</span> {quizDetails[index].score}
                  </p>
                <img
                  src={`data:image/jpeg;base64,${quizDetails[index].base64Image}`}
                  alt="Student Quiz"
                  className="student-quiz-image"
                />
                <div className="score-and-text-container">
                  <div className="table-container">
                    <table className="text-answer-table text-table">
                      <thead>
                        <tr>
                          <th>Extracted Text</th>
                          <th>Answer Key</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="recognized-text">
                            {quizDetails[index].recognizedtext &&
                              quizDetails[index].recognizedtext
                                .split("\n")
                                .slice(1)
                                .map((line, i) => <p key={i}>{line}</p>)}
                          </td>
                          <td className="recognized-text answer-key">
                            {answerKey.split("\n").map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default StudentFile;
