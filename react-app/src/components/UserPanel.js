import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import logo from "./assets/MountainsLogo.png";
import { useNavigate } from 'react-router-dom';
import './css/UserPanel.css';

const UserPanel = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [agreements, setAgreements] = useState([]);
    const [localUserData, setLocalUserData] = useState({
        userID: '',
        userName: '',
        phone: '',
        birthDate: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const userData = response.data;
                const formattedBirthDate = userData.birthDate
                    ? new Date(userData.birthDate).toISOString().split('T')[0]
                    : '';

                setLocalUserData({
                    userID: userData.userID,
                    userName: userData.userName,
                    phone: userData.phone || '',
                    birthDate: formattedBirthDate,
                    userRole: userData.userRole
                });

            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                alert('Не удалось загрузить данные');
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (activeTab === 'agreements' && localUserData.userID) {
            fetchAgreements();
        }
    }, [activeTab, localUserData.userID]);

    const fetchAgreements = async () => {
        try {
            const response = await axios.get(`/api/agreement/user/${localUserData.userID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAgreements(response.data);
        } catch (error) {
            console.error('Ошибка загрузки договоров:', error);
            alert('Не удалось загрузить список договоров');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                userName: localUserData.userName,
                phone: localUserData.phone,
                birthDate: new Date(localUserData.birthDate).toISOString().split('T')[0]
            };

            const response = await axios.put('/api/users/update', payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            updateUser({
                userName: response.data.userName,
                phone: response.data.phone,
                birthDate: response.data.birthDate,
                userRole: response.data.userRole,
                userID: response.data.userID
            });

            setIsEditing(false);
            alert('Изменения успешно сохранены!');

        } catch (error) {
            console.error('Ошибка обновления:', error.response?.data || error.message);
            alert('Не удалось сохранить изменения: ' + error.response?.data?.message);
        }
    };

    const handleCancel = () => {
        setLocalUserData({
            ...localUserData,
            userName: user.userName,
            phone: user.phone,
            birthDate: user.birthDate?.split('T')[0] || ''
        });
        setIsEditing(false);
    };

    const handleDeleteAgreement = async (agreementId) => {
        if (!window.confirm("Вы уверены, что хотите отменить договор?")) return;

        try {
            await axios.delete(`/api/agreement/${agreementId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchAgreements();
            alert("Договор успешно отменен");
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert("Не удалось отменить договор");
        }
    };

    return (
        <div className="container">
            <div className="top-bar">
                <div className="logo-container">
                    <img src={logo} alt="Логотип Турбазы" className="logo" />
                    <span className="logo-text">Турбаза Курсовая</span>
                </div>

                <div className="nav-buttons">
                    <button className="nav-button" onClick={() => navigate('/main')}>
                        Главная
                    </button>
                    <button className="nav-button" onClick={() => navigate('/itemrent')}>
                        Бронирование
                    </button>
                    <button className="nav-button" onClick={() => navigate('/about')}>
                        О нас
                    </button>
                    <button className="nav-button" onClick={() => navigate('/info')}>
                        Контакты
                    </button>
                    <button className="nav-button dashboard-button" onClick={() => navigate('/userPanel')}>
                        Личный кабинет
                    </button>
                </div>
            </div>

            <div className="card">




                <div className="tab-container">
                    <button
                        className={`tab-button ${activeTab === 'profile' ? 'active-tab' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Профиль
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'agreements' ? 'active-tab' : ''}`}
                        onClick={() => setActiveTab('agreements')}
                    >
                        Договоры
                    </button>
                </div>

                {activeTab === 'profile' ? (
                    <>
                        <div className="input-group">
                            <label className="input-label">userName:</label>
                            <input
                                className="input-field"
                                name="userName"
                                value={localUserData.userName}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Phone:</label>
                            <input
                                className="input-field"
                                name="phone"
                                value={localUserData.phone}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                type="tel"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Birth Date:</label>
                            <input
                                className="input-field"
                                name="birthDate"
                                value={localUserData.birthDate}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                type="date"
                            />
                        </div>

                        <div className="button-container">
                            <div className="button-group">
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {!isEditing ? (
                                        <button
                                            className="button save-button"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Редактировать данные
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="button save-button"
                                                onClick={handleSave}
                                            >
                                                Сохранить изменения
                                            </button>
                                            <button
                                                className="button cancel-button"
                                                onClick={handleCancel}
                                            >
                                                Отмена
                                            </button>
                                        </>
                                    )}
                                </div>
                                <button
                                    className="button cancel-button logout-button"
                                    onClick={() => navigate('/logout')}
                                >
                                    Выйти
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="agreements-list">
                        {agreements.length > 0 ? (
                            agreements.map((agreement) => (
                                <div key={agreement.agreementID} className="agreement-card">
                                    <h3 className="agreement-header">Договор №{agreement.agreementID}</h3>
                                    <div className="agreement-content">
                                        <div>
                                            <p className="agreement-text">Предмет: {agreement.objectName}</p>
                                            <p className="agreement-text">Сумма: {agreement.sumPrice} руб.</p>
                                            <p className="agreement-text">
                                                Период: с {new Date(agreement.timeBegin).toLocaleDateString()} по {new Date(agreement.timeEnd).toLocaleDateString()}
                                            </p>
                                            {agreement.agreementInfo && (
                                                <p className="agreement-text">Дополнительная информация: {agreement.agreementInfo}</p>
                                            )}
                                        </div>
                                        <button
                                            className="button cancel-button"
                                            onClick={() => handleDeleteAgreement(agreement.agreementID)}
                                        >
                                            Отменить
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-agreements">У вас пока нет договоров</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPanel;