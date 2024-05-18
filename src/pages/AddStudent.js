import React, { useState, useEffect } from "react";
import "../css/AddStudent.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddStudent = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { classid } = useParams();
  const [userId, setUserId] = useState(null);
  const [studentName, setStudentName] = useState("");
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

  const handleStudentNameChange = (event) => {
    setStudentName(event.target.value);
  };

  const handleDashboardOnclick = () => {
    navigate(`/teacherdashboard/${username}`);
  }

  const handleAddStudent = async () => {
    const studentExists = allStudents.some(
      (student) => `${student.firstname} ${student.lastname}` === studentName
    );
  
    if (!studentExists) {
      setErrorMessage("Student record not found. Please enter a valid student name.");
      return;
    }
  
    try {
      const addStudentResponse = await axios.post(
        "http://localhost:8080/api/students/addstudent",
        { userid: userId, classesid: classid }
      );
      console.log("Student added:", addStudentResponse.data);
      navigate(`/teacherclassfiles/${classid}/${username}`);
    } catch (error) {
      console.error("Error adding student:", error);
      setErrorMessage("Error adding student. Please try again.");
    }
  };  
  
  const handleCloseError = () => {
    setErrorMessage("");
  };

  return (
    <>
      <div className="addstudent-dashboard-container">
        <div className="logo-container">
          <img src="/images/PenScan_Logo.png" alt="Logo" className="logo" onClick={handleDashboardOnclick}/>
          <p className="dashboard-text" onClick={handleDashboardOnclick}>Dashboard</p>
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
        <p className="addstudent-text">Add Student</p>
      </div>
      <div className="input-container">
        <input
          type="text"
          className="class-name-input"
          placeholder="Enter Student Name"
          value={studentName}
          onChange={handleStudentNameChange}
          list="students" 
        />
        <datalist id="students">
          {allStudents.map((student) => (
            <option key={student.userid} value={`${student.firstname} ${student.lastname}`} />
          ))}
        </datalist>
        <button className="addstudent-button" onClick={handleAddStudent}>
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

export default AddStudent;
