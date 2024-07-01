import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    // Lógica para verificar la sesión
    if (!token || !tokenExpiration || new Date(tokenExpiration) <= new Date()) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
