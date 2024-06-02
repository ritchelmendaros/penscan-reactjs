import './App.css';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateClass from './pages/CreateClass';
import TeacherClassFiles from './pages/TeacherClassFiles';
import AddStudent from './pages/AddStudent';
import AddFiles from './pages/AddFiles';
import AddQuiz from './pages/AddQuiz';
import UserProfile from './pages/UserProfile';
import StudentFile from './pages/StudentFile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/userprofile/:username" element={<UserProfile />} /> 
        <Route path="/teacherdashboard/:username" element={<TeacherDashboard />} />
        <Route path="/studentdashboard/:username" element={<StudentDashboard />} />
        <Route path="/createclass/:username" element={<CreateClass />} />
        <Route path="/teacherclassfiles/:classid/:username" element={<TeacherClassFiles />} />
        <Route path="/addstudent/:classid/:username" element={<AddStudent />} />
        <Route path="/addquiz/:classid/:username" element={<AddQuiz />} />
        <Route path="/addfiles/:classid/:username/:userid/:quizid" element={<AddFiles />} />
        <Route path="/studentfiles/:classid/:username" element={<StudentFile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
