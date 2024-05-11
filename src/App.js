import './App.css';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
