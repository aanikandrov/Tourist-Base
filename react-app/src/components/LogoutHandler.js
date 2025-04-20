import { useEffect } from 'react';
import { useAuth } from '../AuthContext';

const LogoutHandler = () => {
    const { logout } = useAuth();

    useEffect(() => {
        localStorage.removeItem('token');
        logout();

        window.history.replaceState(null, '', '/login');
        window.location.href = '/login';
    }, [logout]);

    return null;
};

export default LogoutHandler;