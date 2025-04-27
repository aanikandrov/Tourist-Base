import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './css/AdminPanel.css';
import { MessageBox } from './MessageBox';

const AdminPanelForUsers = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [content, setContent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [newUserData, setNewUserData] = useState({
        userName: '',
        password: '',
        phone: '',
        birthDate: '',
        userRole: ''
    });
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info');

    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = content.filter(user =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/users/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setContent(response.data);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
            showMessage("Ошибка загрузки договоров", 'error');
            setContent([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateUser = () => {
        setIsCreateModalOpen(true);
    };

    const showMessage = (text, type = 'info') => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(null), 5000);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewUserData({
            userName: '',
            password: '',
            phone: '',
            birthDate: 'USER'
        });
    };

    const handleCreateSubmit = async () => {
        try {
            await axios.post('/api/users/register', newUserData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchData();
            handleCloseCreateModal();
            showMessage('Пользователь успешно создан!', 'success');
        } catch (error) {
            console.error('Ошибка создания:', error);
            showMessage('Не удалось создать пользователя', 'error');
        }
    };

    const handleUserDetails = (user) => {
        setEditData(user);
        setIsUserModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/users/delete/${editData.userID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            fetchData();
            handleCloseUserModal();
            showMessage('Пользователь успешно удален!', 'success');
        } catch (error) {
            console.error('Ошибка удаления:', error);
            showMessage(`Не удалось удалить пользователя: ${error.response?.data || error.message}`, 'error');
        }
    };

    const handleCloseUserModal = () => {
        setIsUserModalOpen(false);
        setEditData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/users/update/${editData.userID}`, {
                userName: editData.userName,
                phone: editData.phone,
                birthDate: editData.birthDate,
                userRole: editData.userRole
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            fetchData();
            handleCloseUserModal();
            showMessage('Изменения успешно сохранены!', 'success');
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            showMessage('Не удалось сохранить изменения', 'error');
        }
    };

    const renderUserContent = (item) => (
        <div key={item.userID} className="admin-card">
            <div className="admin-listItem admin-flexItem">
                <div className="admin-userInfo">
                    <strong>ID:</strong> {item.userID} &nbsp;|&nbsp;
                    <strong>Имя:</strong> {item.userName}
                </div>
                <button className="admin-editButton" onClick={() => handleUserDetails(item)}>
                    Подробнее
                </button>
            </div>
        </div>
    );

    return (
        <AdminLayout
            activeTab="user"
            headerTitle="Пользователи"
            showCreateButton
            onCreate={handleCreateUser}
        >

            <div className="admin-search-container">
                <input
                    type="text"
                    placeholder="Поиск по имени пользователя..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                />
            </div>

            {isLoading ? (
                <div className="admin-loading">
                    <div className="admin-loader"></div>
                    Загрузка данных...
                </div>
            ) : (
                filteredUsers.map(renderUserContent)
            )}

            {isCreateModalOpen && (
                <div className="admin-modalOverlay">
                    <div className="admin-modalContent">
                        <h2 className="admin-modalHeader">Создание нового пользователя</h2>
                        <div className="admin-inputGroup">
                            <label>Имя пользователя:</label>
                            <input
                                name="userName"
                                value={newUserData.userName}
                                onChange={(e) => setNewUserData({...newUserData, userName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Пароль:</label>
                            <input
                                type="password"
                                name="password"
                                value={newUserData.password}
                                onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Телефон:</label>
                            <input
                                name="phone"
                                value={newUserData.phone}
                                onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})}
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Дата рождения:</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={newUserData.birthDate}
                                onChange={(e) => setNewUserData({...newUserData, birthDate: e.target.value})}
                            />
                        </div>



                        <div className="admin-modalButtons">

                            <button className="admin-cancelButton" onClick={handleCloseCreateModal}>
                                Отмена
                            </button>
                            <button className="admin-saveButton" onClick={handleCreateSubmit}>
                                Создать
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isUserModalOpen && (
                <div className="admin-modalOverlay">
                    <div className="admin-modalContent">
                        <h2 className="admin-modalHeader">Редактирование пользователя #{editData.userID}</h2>
                        <div className="admin-inputGroup">
                            <label>Имя пользователя:</label>
                            <input
                                name="userName"
                                value={editData.userName || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Телефон:</label>
                            <input
                                name="phone"
                                value={editData.phone || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="admin-inputGroup">
                            <label>Роль:</label>
                            <select
                                name="userRole"
                                value={editData.userRole || ''}
                                onChange={handleInputChange}
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="USER">USER</option>
                            </select>
                        </div>

                        <div className="admin-inputGroup">
                            <label>Дата рождения:</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={editData.birthDate?.split('T')[0] || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-modalButtons">
                            <button
                                className="admin-deleteButton"
                                onClick={handleDelete}
                                style={{backgroundColor: '#ff4444', marginLeft: 'auto'}}
                            >
                                Удалить
                            </button>

                            <button className="admin-cancelButton" onClick={handleCloseUserModal}>
                                Отмена
                            </button>
                            <button className="admin-saveButton" onClick={handleSave}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminPanelForUsers;