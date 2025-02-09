import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import MappingTable from './components/MappingTable';
import Login from './components/Login';
import ViewTable from './components/viewTable'; // Use the correct casing

function App() {
  const defaultUsername = 'a';
  const defaultPassword = 'a';

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = ({ username, password }) => {
    if (username === defaultUsername && password === defaultPassword) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  return (
    <Router>
      <div className="App">
        <h1>Welcome to the App</h1>
        <Routes>
          {/* Default route to redirect to /view-table or /login */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/view-table" /> : <Navigate to="/login" />}
          />
          <Route
            path="/update"
            element={isAuthenticated ? <MappingTable /> : <Navigate to="/login" />}
          />
          <Route
            path="/view-table"
            element={isAuthenticated ? <ViewTable /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
