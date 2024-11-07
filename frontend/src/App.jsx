import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LockersPage from './pages/lockers/LockersPage';
import ShowLockerPage from './pages/lockers/ShowLockerPage';
import EditLockerPage from './pages/lockers/EditLockerPage';
import TopBar from './components/TopBar';

function App() {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lockers" element={<LockersPage />} />
        <Route path="/lockers/:lockerId" element={<ShowLockerPage />} />
        <Route path="/lockers/:lockerId/edit" element={<EditLockerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
