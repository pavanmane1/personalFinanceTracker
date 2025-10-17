import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../components/loadingspiner/LoadingSpiner';

const PrivateRoute = ({ element, allowedRoles = [] }) => {
    const { isAuthenticated, userInfo, loading } = useSelector((state) => state.auth);

    // Show loading spinner while authentication status is being determined
    if (loading.userInfo) {
        return <LoadingSpinner />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && userInfo?.role) {
        const userRole = userInfo.role.toLowerCase();
        return allowedRoles.includes(userRole)
            ? element
            : <Navigate to="/unauthorized" replace />;
    }

    return element;
};

export default PrivateRoute;