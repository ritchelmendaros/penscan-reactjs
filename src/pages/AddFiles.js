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
  }, [classid]);

  const handleDashboardOnclick = () => {
    navigate(`/teacherdashboard/${username}`);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
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
      formData.append("studentid", userId);
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
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/studentquiz/get?id=665b3c540b880636bee5cc41`
        );
        const studentQuiz = response.data;
        setStudentDetails((prevDetails) =>
          prevDetails.map((student, i) =>
            i === index ? { ...student, studentQuiz } : student
          )
        );
        setExpandedStudent(index);
      } catch (error) {
        console.error("Error fetching student quiz details:", error);
      }
    }
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
          <p className="dashboard-text" onClick={handleDashboardOnclick}>
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
        <div className="classes-text-container">
          Class Files
          <button className="upload-button" onClick={handleUploadClick}>
            UPLOAD
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
        </div>
      </div>
      <div className="student">
      {studentDetails.map((student, index) => (
        <div key={index} className="student-item">
          <div className="name-toggle-container" onClick={() => toggleExpand(index, student.id)}>
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
                  student.studentQuiz.recognizedtext.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
              </div>
              <p className="student-score">
                <p style={{fontWeight: "bold"}}>Score:</p> {student.studentQuiz.score}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
    
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
                    alt={`Selected ${index}`}
                    className="preview-image"
                  />
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFiles;
