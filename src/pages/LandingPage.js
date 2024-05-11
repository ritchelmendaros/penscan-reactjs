import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LandingPage.css'; 

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="landing-page">
      <img src="/images/PenScan_Logo.png" alt="Landing Page" className="landing-page-image" />
      <h1 className="landing-page-text">PenScan</h1>
    </div>
  );
}

export default LandingPage;
