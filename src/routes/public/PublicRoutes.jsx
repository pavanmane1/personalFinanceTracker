import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ element }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

export default PublicRoute;