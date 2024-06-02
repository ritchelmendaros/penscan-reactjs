import React, { useState, useEffect } from "react";
import "../css/CreateClass.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CreateClass = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [userId, setUserId] = useState(null);
  const [classname, setClassname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleClassnameChange = (event) => {
    setClassname(event.target.value);
  };

  const handleDashboardOnclick = () => {
    navigate(`/teacherdashboard/${username}`);
  };

  const handleCreateClass = async () => {
    if (!classname) {
      setErrorMessage("Class name cannot be empty.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/classes/checkclass?classname=${classname}&teacherid=${userId}`
      );

      if (response.data) {
        setErrorMessage("Class name already exists.");
      } else {
        const addClassResponse = await axios.post(
          "http://localhost:8080/api/classes/add",
          { classname, teacherid: userId }
        );
        console.log("Class added:", addClassResponse.data);
        navigate(`/teacherdashboard/${username}`);
      }
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  const handleCloseError = () => {
    setErrorMessage("");
  };

  const handleUserProfileClick = (classId) => {
    navigate(`/userprofile/${username}`);
  };

  return (
    <>
      <div className="createclass-dashboard-container">
        <div className="logo-container">
          <img src="/images/PenScan_Logo.png" alt="Logo" className="logo" onClick={handleDashboardOnclick} />
          <p className="dashboard-text" onClick={handleDashboardOnclick}>Dashboard</p>
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
      <div className="createclass-container">
        <p className="createclass-text">Create a Class</p>
      </div>
      <div className="input-container">
        <input
          type="text"
          className="class-name-input"
          placeholder="Enter Class Name"
          value={classname}
          onChange={handleClassnameChange}
        />
        <button className="create-class-button" onClick={handleCreateClass}>
          CREATE
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

export default CreateClass;
