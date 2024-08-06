import React, { useState, useEffect, useRef } from "react";
import "../css/AddFiles.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

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
  const [isLoading, setIsLoading] = useState(false);
  const [itemAnalysis, setItemAnalysis] = useState([]);
  const [editableText, setEditableText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/getuserid?username=${username}`
        );
        setUserId(response.data);
      } catch (error) {
        toast.error("Error fetching user ID: " + error.message);
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
        toast.error("Error fetching student details:", error);
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
        toast.error("Error fetching answer key:", error);
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
      toast.error("Error fetching scores and student details:", error);
    }
  };

  useEffect(() => {
    if (showAnalysis) {
      fetchScoresAndStudentDetails();
    }
  }, [showAnalysis, quizid]);

  const fetchItemAnalysis = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/item-analysis/getitemanalysis?quizid=${quizid}`
      );
      setItemAnalysis(response.data);
    } catch (error) {
      toast.error("Error fetching item analysis:", error);
    }
  };

  useEffect(() => {
    if (showAnalysis) {
      fetchItemAnalysis();
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
        setIsLoading(true);
        const response = await axios.post(
          "http://localhost:8080/api/studentquiz/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(response.data);
        setShowModal(false);
      } catch (error) {
        setShowModal(false);
        toast.error(error.response.data);
      } finally {
        setIsLoading(false);
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
        if (studentQuiz) {
          setEditableText(studentQuiz.recognizedtext); 
          setCurrentStudentId(studentQuiz.studentquizid);
        }
      } catch (error) {
        toast.error("No Answers Found", error);
        if (error.response && error.response.status === 404) {
          setExpandErrors((prevErrors) => {
            const updatedErrors = [...prevErrors];
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

  const handleEditClick = (studentQuizId) => {
    const student = studentDetails.find(
      (student) => student.studentQuiz.studentQuizId === studentQuizId
    );

    if (student) {
      setEditableText(student.studentQuiz.recognizedtext);
      setIsEditing(true);
      toast.log("Editing for Quiz ID:", currentStudentId); 
    } else {
      toast.error("Student not found for Quiz ID:", quizid); 
    }
  };

  const handleSaveClick = async () => {
    if (!editableText) {
      toast.error("Text is required to save changes.");
      return; 
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/studentquiz/edit`,
        {
          studentQuizId: currentStudentId,
          newText: editableText, 
        }
      );
      toast.success(response.data); 
      setIsEditing(false); 
      setCurrentStudentId(null); 
      window.location.reload();
      toast.success("Successfully saved changes for Quiz ID:", quizid);
    } catch (error) {
      toast.error("Error saving changes: " + error.message);
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/studentquiz/getscoresandstudentids?quizid=${quizid}`
      );
      const scoresAndStudentDetails = response.data;

      const worksheetData = Object.entries(scoresAndStudentDetails).map(
        ([studentId, details]) => ({
          "Student Name": `${details.firstName} ${details.lastName}`, 
          Score: details.score,
        })
      );

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new(); 
      XLSX.utils.book_append_sheet(workbook, worksheet, "Scores"); 

      XLSX.writeFile(workbook, "Student_Scores.xlsx");
    } catch (error) {
      toast.error("Error downloading Excel file: " + error.message);
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
      <ToastContainer />
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
            marginLeft: "850px",
          }}
        >
          Upload
        </button>
        <button
          className="upload-button"
          onClick={downloadExcel}
          style={{
            backgroundColor: " #002c66",
            color: "white",
            borderRadius: "5px",
            marginLeft: "15px",
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis", 
            width: "auto",
          }}
        >
          Download Excel
        </button>
      </div>
      {showAnalysis ? (
        <div className="analysis-table">
          <div>
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
          <div>
            <h3>Item Analysis</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Correct</th>
                  <th>Incorrect</th>
                </tr>
              </thead>
              <tbody>
                {itemAnalysis
                  .sort((a, b) => a.itemNumber - b.itemNumber)
                  .map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemNumber}</td>
                      <td>{item.correctCount}</td>
                      <td>{item.incorrectCount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
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
                  <p
                    className="student-score"
                    style={{ fontWeight: "bold", marginTop: "20px" }}
                  >
                    <span>Score:</span> {student.studentQuiz.score}
                  </p>
                  <img
                    src={`data:image/jpeg;base64,${student.studentQuiz.base64Image}`}
                    alt="Student Quiz"
                    className="student-quiz-image"
                  />
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
                            {isEditing ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                {editableText
                                  .split("\n")
                                  .slice(1) 
                                  .map((line, i) => (
                                    <input
                                      key={i}
                                      value={line}
                                      onChange={(e) => {
                                        const lines = editableText.split("\n");
                                        lines[i + 1] = e.target.value; 
                                        setEditableText(lines.join("\n")); 
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          const lines =
                                            editableText.split("\n");
                                          
                                          lines.splice(i + 2, 0, "");
                                          setEditableText(lines.join("\n"));
                                        }
                                      }}
                                      style={{
                                        border: "none",
                                        borderBottom: "1px solid #ccc",
                                        padding: "5px",
                                        fontSize: "16px",
                                        lineHeight: "1.5",
                                        backgroundColor: "transparent",
                                        color: "inherit",
                                        width: "100%",
                                      }}
                                    />
                                  ))}
                              </div>
                            ) : (
                              student.studentQuiz.recognizedtext &&
                              student.studentQuiz.recognizedtext
                                .split("\n")
                                .slice(1) 
                                .map((line, i) => <p key={i}>{line}</p>)
                            )}
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
                  <button
                    onClick={() => {
                      if (isEditing) {
                        handleSaveClick(); 
                      } else {
                        handleEditClick(student.studentQuiz.studentQuizId); 
                      }
                    }}
                    style={{
                      marginTop: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#002c66",
                      fontSize: "15px",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
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
            <button
              className={`upload-button ${
                isLoading ? "loading" : "upload-button"
              }`}
              onClick={handleSubmit}
            >
              {isLoading ? "Loading..." : "Upload"}
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
