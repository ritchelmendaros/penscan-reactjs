import React, { useState, useEffect, useRef } from "react";
import "../css/AddFiles.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddFiles = () => {
  const navigate = useNavigate();
  const { username, classid } = useParams();
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("Class Files");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentQuiz, setStudentQuiz] = useState(null); // State to hold student quiz data
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
      formData.append("quizid", "your_quiz_id_here");
      formData.append("studentid", userId);
      formData.append("score", 100);
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
        // Extract the student quiz ID from the response
        const studentQuizId = response.data.split("ID: ")[1];
        // Fetch the uploaded data using the extracted ID
        const { data: studentQuizData } = await axios.get(
          `http://localhost:8080/api/studentquiz/get?id=${studentQuizId}` // Modified to use query parameter
        );
        setStudentQuiz(studentQuizData);
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
        <div className="classes-text-container">
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
        </div>
        {activeTab === "Students" && (
          <button className="create-class-button" onClick={handleAddClick}>
            Add Student
          </button>
        )}
      </div>
      <div className="center-container">
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

      {/* Display the image and recognized text */}
      <div className="student-quiz-details">
        <h2>Student Quiz Details</h2>
        {studentQuiz && (
          <div>
            <img
              src={`data:image/jpeg;base64,${studentQuiz.base64Image}`}
              alt="Quiz Image"
            />
          </div>
        )}
        <div>
          <h3>Recognized Text:</h3>
          <p>{studentQuiz?.recognizedtext}</p>
        </div>
      </div>
    </>
  );
};

export default AddFiles;
