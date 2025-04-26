import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../AuthContext';

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import LoginPage from './LoginForm';

const ProtectedRoute = ({children, allowedRoles, requiredRole}) => {
    const {user, loading} = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    if (allowedRoles?.includes('GUEST') && !user) {
        return children;
    }

    const hasToken = !!localStorage.getItem('token');
    if (!hasToken) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    if (requiredRole && user.userRole !== requiredRole) {
        return <Navigate to="/" replace/>;
    }

    if (allowedRoles && !allowedRoles.includes(user.userRole)) {
        return <Navigate to="/" replace/>;
    }

    return children;
};


export default ProtectedRoute;