import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import AuthService from './components/service/AuthService';
import RatedPage from './components/local/RatedPage';
import SearchPage from './components/local/SearchPage';


function MainApp({ isAuthenticated, isAdmin, onLogin, onLogout }) {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route exact path="/" element={<LoginPage onLogin={onLogin} />} />
          <Route exact path="/login" element={<LoginPage onLogin={onLogin} />} />
          <Route path="/search" element={isAuthenticated ? <SearchPage onLogout={onLogout} /> : <Navigate to="/login" />} />
          <Route path="/rated" element={isAuthenticated ? <RatedPage onLogout={onLogout} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(AuthService.isAdmin());

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
    setIsAdmin(AuthService.isAdmin());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(AuthService.isAuthenticated());
    setIsAdmin(AuthService.isAdmin());
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <BrowserRouter>
      <MainApp
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
}