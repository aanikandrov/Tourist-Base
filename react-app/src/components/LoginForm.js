import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';
import logo from "./assets/MountainsLogo.png";


const LoginForm = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const {login, checkAuth} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `userName=${encodeURIComponent(userName)}&password=${encodeURIComponent(password)}`,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);

            await checkAuth();
            setSuccess(true);
            setTimeout(() => navigate('/main'), 1000);
        } catch (err) {
            setError('Login failed!');
        }
    };

    return (
        <div className="auth-form">

            <div style={{textAlign: 'center', marginBottom: '20px'}}>
                <img
                    src={logo}
                    alt="Описание изображения"
                    style={{width: '150px', height: 'auto'}}
                />
            </div>

            <h2>Добро пожаловать!</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {success && <div className="success">✅ Login successful! Redirecting...</div>}
                {error && <div className="error">❌ {error}</div>}

                <button type="submit">Войти
                </button>

                <button type="submit" onClick={() => navigate('/register')}>Регистрация
                </button>


            </form>
        </div>
    );
};

export default LoginForm;