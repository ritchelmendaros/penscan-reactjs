import React, { useState, useEffect } from "react";
import "../css/CreateClass.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CreateClass = () => {

  const navigate = useNavigate();
  const { username } = useParams();
  const [userId, setUserId] = useState(null);
  const [classname, setClassname] = useState("");

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

  const handleCreateClass = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/classes/add",
        { classname, teacherid: userId }
      );
      console.log("Class added:", response.data);
      navigate(`/teacherdashboard/${username}`);
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  return (
    <>
      <div className="createclass-dashboard-container">
        <div className="logo-container">
          <img src="/images/PenScan_Logo.png" alt="Logo" className="logo" />
          <p className="dashboard-text">Dashboard</p>
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
      <div className="createclass-container">
        <p className="createclass-text">Create a Class</p>
      </div>
      <div className="input-container">
        <input
          type="text"
          className="class-name-input"
          placeholder="Enter Class Name"
          value={classname} // Bind value to state
          onChange={handleClassnameChange} // Handle input change
        />
        <button className="create-class-button" onClick={handleCreateClass}>
          CREATE
        </button>
      </div>
    </>
  );
};

export default CreateClass;