import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import logo from "./assets/MountainsLogo.png";
import './css/MainDesign.css';

const RegisterForm = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phone && !/^\d{11}$/.test(phone)) {
            setMessage('❌ Телефон должен содержать 11 цифр');
            return;
        }

        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 18);
        if (new Date(birthDate) > minDate) {
            setMessage('❌ Вам должно быть больше 18 лет');
            return;
        }

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

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 400 && errorData.message) {
                    if (errorData.message.includes("Username is already taken")) {
                        setMessage("❌ Имя пользователя уже занято");
                    } else if (errorData.message.includes("Phone is already taken")) {
                        setMessage("❌ Этот номер телефона уже используется");
                    } else {
                        setMessage(`❌ Ошибка: ${errorData.message}`);
                    }
                } else {
                    setMessage(`❌ Ошибка сервера...`);
                }
                return;
            }

            const data = await response.json();
            setMessage('✅ Перенаправление на страницу входа...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMessage('❌ Ошибка соединения с сервером');
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

                <button type="button"
                        onClick={() => navigate('/login')}
                        className = "user-cancel-button"
                >
                    Назад
                </button>

                <button type="submit" >Зарегистироваться</button>


            </form>
        </div>
    );
};

export default RegisterForm;