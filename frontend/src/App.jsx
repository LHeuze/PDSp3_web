import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LockersPage from './pages/lockers/LockersPage';
import ShowLockerPage from './pages/lockers/ShowLockerPage';
import EditLockerPage from './pages/lockers/EditLockerPage';
import LoginPage from './pages/login/LoginPage';
import TopBar from './components/TopBar';

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage when the app initializes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <TopBar user={user} onLogout={handleLogout} /> {/* Pass user and onLogout to TopBar */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Login page: redirects to home if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage setUser={setUser} />}
        />
        
        {/* Protected routes that require a logged-in user */}
        <Route
          path="/lockers"
          element={
            user ? <LockersPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/lockers/:lockerId"
          element={
            user ? <ShowLockerPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/lockers/:lockerId/edit"
          element={
            user ? <EditLockerPage /> : <Navigate to="/login" replace />
          }
        />
        
        {/* Catch-all route: redirects to home or login based on authentication */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
