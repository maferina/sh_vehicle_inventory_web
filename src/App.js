import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import VehicleList from './pages/VehicleList';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Configuration from './pages/Configuration';
import UserList from './pages/UserList';
import ProtectedRoute from './ProtectedRoute';
import SessionManager from './SessionManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRouteWrapper />}>
          <Route path="vehicle" element={<VehicleList />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="configuration" element={<Configuration />} />
          <Route path="user" element={<UserList />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function ProtectedRouteWrapper() {
  return (
    <ProtectedRoute>
      <SessionManager />
      <WithHeader />
    </ProtectedRoute>
  );
}

function WithHeader() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
