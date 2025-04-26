import React, {createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({
    token: null,
    user: null,
    login: () => {
    },
    logout: () => {
    }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const interceptor = (response) => {
            if (response.status === 401) {
                logout();
                navigate('/login');
            }
            return response;
        };

        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            interceptor(response);
            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    const updateUser = (newUserData) => {
        setUser(prev => ({ ...prev, ...newUserData }));
    };

    const login = async (userData) => {
        localStorage.setItem('token', userData.token);
        await checkAuth();
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            localStorage.removeItem('token');
            setUser(null);

            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{user, loading, login, logout, checkAuth, updateUser}}>
            {children}
        </AuthContext.Provider>
    );
};

