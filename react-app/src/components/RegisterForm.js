import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import logo from "./assets/MountainsLogo.png";

const RegisterForm = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: userName,
                    password: password,
                    phone: phone,
                    birthDate: birthDate
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('✅ Good! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMessage(`❌ Error: ${data.error || 'Registration failed'}`);
            }
        } catch (err) {
            setMessage('❌ Connection error');
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


            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>

                <div>
                    <label>Задайте имя пользователя:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Задайте пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Укажите номер телефона:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Укажите дату рождения:</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                </div>


                {message && <div className="message">{message}</div>}
                <button type="submit">Зарегистироваться</button>
            </form>
        </div>
    );
};

export default RegisterForm;