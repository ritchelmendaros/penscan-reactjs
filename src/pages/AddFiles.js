import React, { useState, useEffect, useRef } from "react";
import "../css/AddFiles.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddFiles = () => {
  const navigate = useNavigate();
  const { username, classid, teacherid, quizid } = useParams();
  const [userId, setUserId] = useState(null);
  const [userClasses, setUserClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("Class Files");
  const [students, setStudents] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/getuserid?username=${username}`
        );
        setUserId(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [username]);

  useEffect(() => {
    const fetchUserClasses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/classes/getclassesbyteacherid?teacherid=${userId}`
        );
        setUserClasses(response.data);
        console.log("User Classes:", response.data);
      } catch (error) {
        console.error("Error fetching user classes:", error);
      }
    };

    if (userId) {
      fetchUserClasses();
    }
  }, [userId]);

  useEffect(() => {
    if (activeTab === "Students") {
      const fetchStudents = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/users/getallstudents`
          );
          setStudents(response.data);
          console.log("Students:", response.data);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      };

      fetchStudents();
    }
  }, [activeTab]);

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
    // Clear the input value to allow re-selecting the same file
    fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    console.log("Files submitted:", selectedFiles);
    setShowModal(false);
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
    </>
  );
};

export default AddFiles;
