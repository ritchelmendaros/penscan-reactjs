import React, { useState, useEffect, useRef } from "react";
import "../css/AddFiles.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddFiles = () => {
  const navigate = useNavigate();
  const { username, classid, quizid } = useParams();
  const [userId, setUserId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentDetails, setStudentDetails] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const fileInputRef = useRef(null);
  const [expandErrors, setExpandErrors] = useState([]);
  const [answerKey, setAnswerKey] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);

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
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/students/getstudentsbyclassid?classid=${classid}`
        );
        setStudentDetails(response.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [classid, showAnalysis]);

  useEffect(() => {
    const fetchAnswerKey = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/quiz/getanswerkey?quizid=${quizid}`
        );
        setAnswerKey(response.data);
      } catch (error) {
        console.error("Error fetching answer key:", error);
      }
    };

    fetchAnswerKey();
  }, [quizid]);

  const fetchScoresAndStudentDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/studentquiz/getscoresandstudentids?quizid=${quizid}`
      );
      const scoresAndStudentDetails = response.data;
      const studentDetailsArray = Object.entries(scoresAndStudentDetails).map(
        ([studentId, details]) => ({
          studentId,
          ...details,
        })
      );
      setStudentDetails(studentDetailsArray);
    } catch (error) {
      console.error("Error fetching scores and student details:", error);
    }
  };

  useEffect(() => {
    if (showAnalysis) {
      fetchScoresAndStudentDetails();
    }
  }, [showAnalysis, quizid]);

  const handleDashboardOnclick = () => {
    navigate(`/teacherdashboard/${username}`);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleAnalysisClick = () => {
    setShowAnalysis(true);
  };

  const handleClassFilesClick = () => {
    setShowAnalysis(false);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setShowModal(true);
    fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append("quizid", quizid);
      formData.append("image", selectedFiles[0]);

      try {
        const response = await axios.post(
          "http://localhost:8080/api/studentquiz/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("File uploaded successfully:", response.data);
        setShowModal(false);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles(
      selectedFiles.filter((file, index) => index !== indexToRemove)
    );
  };

  const toggleExpand = async (index, studentId) => {
    if (expandedStudent === index) {
      setExpandedStudent(null);
      setExpandErrors((prevErrors) => {
        const updatedErrors = [...prevErrors];
        updatedErrors[index] = null;
        return updatedErrors;
      });
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/studentquiz/get?studentid=${studentId}&quizid=${quizid}`
        );
        const studentQuiz = response.data;
        if (studentQuiz.message) {
          setExpandErrors((prevErrors) => {
            const updatedErrors = [...prevErrors];
            updatedErrors[index] = studentQuiz.message;
            return updatedErrors;
          });
        } else if (!studentQuiz.base64Image) {
          setExpandErrors((prevErrors) => {
            const updatedErrors = [...prevErrors];
            updatedErrors[index] = "No data found.";
            return updatedErrors;
          });
        } else {
          setExpandErrors((prevErrors) => {
            const updatedErrors = [...prevErrors];
            updatedErrors[index] = null;
            return updatedErrors;
          });
          setStudentDetails((prevDetails) =>
            prevDetails.map((student, i) =>
              i === index ? { ...student, studentQuiz } : student
            )
          );
          setExpandedStudent(index);
        }
      } catch (error) {
        console.error("Error fetching student quiz details:", error);
        if (error.response && error.response.status === 404) {
          setExpandErrors((prevErrors) => {
            const updatedErrors = [...prevErrors];
            updatedErrors[index] = "No Answers Found";
            return updatedErrors;
          });
        } else {
          setExpandErrors((prevErrors) => {
            const updatedErrors = [...prevErrors];
            updatedErrors[index] = "Error fetching data.";
            return updatedErrors;
          });
        }
        setExpandedStudent(index);
      }
    }
  };

  const handleUserProfileClick = () => {
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
          className={`class-files-button ${!showAnalysis ? "active" : ""}`}
          onClick={handleClassFilesClick}
        >
          Class Files
        </button>
        <button
          className={`analysis-button ${showAnalysis ? "active" : ""}`}
          onClick={handleAnalysisClick}
        >
          Analysis
        </button>
        <button
          className="upload-button"
          onClick={handleUploadClick}
          style={{
            backgroundColor: " #002c66",
            color: "white",
            borderRadius: "5px",
            marginLeft: "1050px",
          }}
        >
          Upload
        </button>
      </div>
      {showAnalysis ? (
        <div className="analysis-table">
          <h3>Student Rankings</h3>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {studentDetails
                .sort((a, b) => b.score - a.score)
                .map((student, index) => (
                  <tr key={index}>
                    <td>
                      {student.firstName} {student.lastName}
                    </td>
                    <td>{student.score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="student">
          {studentDetails.map((student, index) => (
            <div key={index} className="student-item">
              <div
                className="name-toggle-container"
                onClick={() => toggleExpand(index, student.userid)}
              >
                <img
                  src={
                    expandedStudent === index
                      ? "/images/expand2.png"
                      : "/images/expand1.png"
                  }
                  alt="Expand"
                  className="expand-icon"
                />
                <p className="student-name">
                  {student.firstname} {student.lastname}
                </p>
              </div>
              {expandedStudent === index && student.studentQuiz && (
                <div className="additional-content">
                  <img
                    src={`data:image/jpeg;base64,${student.studentQuiz.base64Image}`}
                    alt="Student Quiz"
                    className="student-quiz-image"
                  />
                  <div className="recognized-text">
                    <p style={{ fontWeight: "bold" }}>Extracted Text</p>
                    {student.studentQuiz.recognizedtext &&
                      student.studentQuiz.recognizedtext
                        .split("\n")
                        .map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                  <div className="recognized-text answer-key">
                    <p style={{ fontWeight: "bold" }}>Answer Key</p>
                    {answerKey.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <p className="student-score">
                    <span style={{ fontWeight: "bold" }}>Score:</span>{" "}
                    {student.studentQuiz.score}
                  </p>
                </div>
              )}
              {expandedStudent === index && expandErrors[index] && (
                <div className="additional-content">
                  <div className="error-message">{expandErrors[index]}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            <h3>Selected Images</h3>
            <div className="image-preview-container">
              {selectedFiles.map((file, index) => (
                <div key={index} className="image-preview">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected file ${index}`}
                    className="preview-image"
                  />
                  <button
                    className="remove-image-button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="upload-button" onClick={handleSubmit}>
              Upload
            </button>
          </div>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </>
  );
};

export default AddFiles;
