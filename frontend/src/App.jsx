import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import './App.css';

function App() {
  const { token, loading, user } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} />} />
        <Route path="/dashboard" element={token && user?.role !== 'admin' ? <Dashboard /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/login'} />} />
        <Route path="/admin" element={token && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
        <Route path="/projects" element={token ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/projects/:id" element={token ? <ProjectDetail /> : <Navigate to="/login" />} />
        <Route path="/" element={token ? <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
