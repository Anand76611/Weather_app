import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Weather from './components/Weather';
import './App.css';

const App = () => {
  const [token, setToken] = useState('');
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsTokenChecked(true); // Ensure token check is completed
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  if (!isTokenChecked) return null; // Render nothing until token is checked

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/weather" /> : <Login setToken={(t) => { localStorage.setItem('token', t); setToken(t); }} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/weather" element={token ? <Weather token={token} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? '/weather' : '/login'} />} />
      </Routes>
    </Router>
  );
};

export default App;
