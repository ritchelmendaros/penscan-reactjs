import './App.css';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/teacherdashboard/:username" element={<TeacherDashboard />} />
        <Route path="/studentdashboard/:username" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
