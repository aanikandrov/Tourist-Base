// ProtectedRoute.js
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../AuthContext';

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import AdminPanel from './AdminPanel';
import LoginPage from './LoginForm';

const ProtectedRoute = ({children, allowedRoles, requiredRole}) => {
    const {user, loading} = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    // Разрешаем доступ гостям, если это указано в allowedRoles
    if (allowedRoles?.includes('GUEST') && !user) {
        return children;
    }

    // Проверка токена для остальных случаев
    const hasToken = !!localStorage.getItem('token');
    if (!hasToken) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    // Остальные проверки ролей
    if (requiredRole && user.userRole !== requiredRole) {
        return <Navigate to="/" replace/>;
    }

    if (allowedRoles && !allowedRoles.includes(user.userRole)) {
        return <Navigate to="/" replace/>;
    }

    return children;
};


// const ProtectedRoute = ({children, allowedRoles, requiredRole}) => {
//     const {user, loading} = useAuth();
//     const location = useLocation();
//
//     // Проверка наличия токена в localStorage
//     const hasToken = !!localStorage.getItem('token');
//
//     if (loading) return <div>Loading...</div>;
//
//     if (!hasToken) {
//         return <Navigate to="/login" state={{from: location}} replace/>;
//     }
//
//     if (allowedRoles?.includes('GUEST') && !user) {
//         return children;
//     }
//
//     if (!user) {
//         return <Navigate to="/login" replace/>;
//     }
//
//     if (requiredRole && user.userRole !== requiredRole) {
//         return <Navigate to="/" replace/>;
//     }
//
//     if (allowedRoles && !allowedRoles.includes(user.userRole)) {
//         return <Navigate to="/" replace/>;
//     }
//
//     return children;
// };

export default ProtectedRoute;