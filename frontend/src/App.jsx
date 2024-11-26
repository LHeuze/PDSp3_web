import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LockersPage from './pages/lockers/LockersPage';
import ShowLockerPage from './pages/lockers/ShowLockerPage';
import EditLockerPage from './pages/lockers/EditLockerPage';
import LockerLogPage from './pages/lockers/LockerLogPage';
import LockerAdminPage from './pages/locker_adminstrators/LockerAdminPage';
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

  // Protected Route component
  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <TopBar user={user} onLogout={handleLogout} /> {/* Pass user and onLogout to TopBar */}
      <Routes>
        {/* Redirect to login if not authenticated */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage setUser={setUser} />}
        />
        
        {/* Protected routes that require a logged-in user */}
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/locker_administrators/:adminId/lockers" element={<ProtectedRoute element={<LockersPage />} />} />
        <Route path="/lockers/:lockerId" element={<ProtectedRoute element={<ShowLockerPage />} />} />
        <Route path="/locker_administrators" element={<ProtectedRoute element={<LockerAdminPage />} />} />
        <Route path="/lockers/:lockerId/edit" element={<ProtectedRoute element={<EditLockerPage />} />} />
        <Route path="/lockers/:lockerId/log" element={<LockerLogPage />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
