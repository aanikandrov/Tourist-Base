import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import './css/AdminPanel.css';

const AdminPanel = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('user');
    const [content, setContent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAgreement, setSelectedAgreement] = useState(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({
        userName: '',
        password: '',
        phone: '',
        birthDate: ''
    });

    const endpointMap = {
        user: '/api/users/all',
        item: '/api/rental/items',
        agreement: '/api/agreement/admin/all'
    };

    const handleCreateUser = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewUserData({
            userName: '',
            password: '',
            phone: '',
            birthDate: ''
        });
    };

    const handleCreateSubmit = async () => {
        try {
            await axios.post('/api/users/register', newUserData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchData(endpointMap.user);
            handleCloseCreateModal();
            alert('Пользователь успешно создан!');
        } catch (error) {
            console.error('Ошибка создания:', error);
            alert('Не удалось создать пользователя');
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setContent([]);
        setIsLoading(true);
    };

    const fetchData = async (endpoint) => {
        try {
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setContent(response.data);
        } catch (error) {
            console.error(`Ошибка загрузки ${endpoint}:`, error);
            alert(`Не удалось загрузить данные ${endpoint}`);
            setContent([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (endpointMap[activeTab]) {
            fetchData(endpointMap[activeTab]);
        }
    }, [activeTab]);

    const handleUserDetails = (user) => {
        setEditData(user);
        setIsUserModalOpen(true);
    };

    const handleCloseUserModal = () => {
        setIsUserModalOpen(false);
        setEditData({});
    };

    const handleEdit = (item) => {
        switch(activeTab) {
            case 'user':
                setSelectedUser(item);
                setIsUserModalOpen(true);
                break;
            case 'item':
                setSelectedItem(item);
                setIsItemModalOpen(true);
                break;
            case 'agreement':
                setSelectedAgreement(item);
                setIsAgreementModalOpen(true);
                break;
        }
        setEditData(item);
    };

    const handleCloseItemModal = () => {
        setIsItemModalOpen(false);
        setSelectedItem(null);
        setEditData({});
    };

    const handleCloseAgreementModal = () => {
        setIsAgreementModalOpen(false);
        setSelectedAgreement(null);
        setEditData({});
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setSelectedItem(null);
        setEditData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const renderModals = () => (
        <>
            {isUserModalOpen && renderUserModal()}
            {isItemModalOpen && renderItemModal()}
            {isAgreementModalOpen && renderAgreementModal()}

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
        </>


    );

    const renderItemModal = () => (
        <div className="admin-modalOverlay">
            <div className="admin-modalContent">
                <h2 className="admin-modalHeader">Редактирование инвентаря #{editData.objectID}</h2>
                {renderFormFields()}
                <div className="admin-modalButtons">
                    <button className="admin-cancelButton" onClick={handleCloseItemModal}>
                        Отмена
                    </button>
                    <button className="admin-saveButton" onClick={handleSave}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );

    const renderAgreementModal = () => (
        <div className="admin-modalOverlay">
            <div className="admin-modalContent">
                <h2 className="admin-modalHeader">Редактирование договора #{editData.agreementID}</h2>
                {renderFormFields()}
                <div className="admin-modalButtons">
                    <button className="admin-cancelButton" onClick={handleCloseAgreementModal}>
                        Отмена
                    </button>
                    <button className="admin-saveButton" onClick={handleSave}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );

    const handleSave = async () => {
        try {
            let endpoint = '';
            let payload = {};

            switch(activeTab) {
                case 'user':
                    endpoint = `/api/users/update/${editData.userID}`;
                    payload = {
                        userName: editData.userName,
                        phone: editData.phone,
                        birthDate: editData.birthDate
                    };
                    break;
                case 'item':
                    endpoint = `/api/rental/${editData.objectID}`;
                    payload = {
                        objectName: editData.objectName,
                        price: editData.price,
                        objectInfo: editData.objectInfo
                    };
                    break;
                case 'agreement':
                    endpoint = `/api/agreement/${editData.agreementID}`;
                    payload = {
                        timeBegin: editData.timeBegin,
                        timeEnd: editData.timeEnd,
                        agreementInfo: editData.agreementInfo
                    };
                    break;
            }

            await axios.put(endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            fetchData(endpointMap[activeTab]);
            handleCloseModal();
            handleCloseUserModal();
            alert('Изменения успешно сохранены!');
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Не удалось сохранить изменения');
        }
    };

    const renderFormFields = () => {
        switch(activeTab) {
            case 'user':
                return (
                    <>
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
                            <input
                                name="userRole"
                                value={editData.userRole || ''}
                                onChange={handleInputChange}
                            />
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
                    </>
                );
            case 'item':
                return (
                    <>
                        <div className="admin-inputGroup">
                            <label>Название:</label>
                            <input
                                name="objectName"
                                value={editData.objectName || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Цена:</label>
                            <input
                                type="number"
                                name="price"
                                value={editData.price || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Описание:</label>
                            <textarea
                                name="objectInfo"
                                value={editData.objectInfo || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </>
                );
            case 'agreement':
                return (
                    <>
                        <div className="admin-inputGroup">
                            <label>Дата начала:</label>
                            <input
                                type="date"
                                name="timeBegin"
                                value={editData.timeBegin?.split('T')[0] || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Дата окончания:</label>
                            <input
                                type="date"
                                name="timeEnd"
                                value={editData.timeEnd?.split('T')[0] || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Комментарий:</label>
                            <textarea
                                name="agreementInfo"
                                value={editData.agreementInfo || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const renderContentItem = (item) => (
        <div key={item.id || item.objectID || item.agreementID} className="admin-card">
            {Object.entries(item).map(([key, value]) => (
                <div key={key} className="admin-listItem">
                    <strong>{key}:</strong> {value?.toString()}
                </div>
            ))}
            <button className="admin-editButton" onClick={() => handleEdit(item)}>
                Редактировать
            </button>
        </div>
    );

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

    const renderDefaultContent = (item) => (
        <div key={item.id || item.objectID || item.agreementID} className="admin-card">
            {activeTab === 'item' && (
                <div className="admin-listItem admin-flexItem">
                    <div>
                        <strong>ID:</strong> {item.objectID} &nbsp;|&nbsp;
                        <strong>Название:</strong> {item.objectName}
                    </div>
                    <button className="admin-editButton" onClick={() => handleEdit(item)}>
                        Подробнее
                    </button>
                </div>
            )}
            {activeTab === 'agreement' && (
                <div className="admin-listItem admin-flexItem">
                    <div>
                        <strong>ID agr:</strong> {item.agreementID} &nbsp;|&nbsp;
                        <strong>ID user:</strong> {item.userID} &nbsp;|&nbsp;
                        <strong>ID object:</strong> {item.objectID} &nbsp;|&nbsp;
                        <strong>Период:</strong> [{item.timeBegin} &nbsp;|&nbsp; {item.timeEnd}]

                    </div>
                    <button className="admin-editButton" onClick={() => handleEdit(item)}>
                        Подробнее
                    </button>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        if (!content.length) return <div className="admin-card">Нет данных</div>;
        return content.map(item =>
            activeTab === 'user' ? renderUserContent(item) : renderDefaultContent(item)
        );
    };

    const renderUserModal = () => (
        <div className="admin-modalOverlay">
            <div className="admin-modalContent">
                <h2 className="admin-modalHeader">Редактирование пользователя #{editData.userID}</h2>
                {renderFormFields()}
                <div className="admin-modalButtons">
                    <button className="admin-cancelButton" onClick={handleCloseUserModal}>
                        Отмена
                    </button>
                    <button className="admin-saveButton" onClick={handleSave}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );

    const getTabTitle = () => {
        switch(activeTab) {
            case 'user': return 'Все пользователи';
            case 'item': return 'Весь инвентарь';
            case 'agreement': return 'Все договоры';
            default: return '';
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <h2 className="admin-sidebarTitle">Админ-панель</h2>


                <h1 className="admin-header">
                    {getTabTitle()}
                    {activeTab === 'user' && (
                        <button
                            className="admin-editButton"
                            style={{marginLeft: '1rem'}}
                            onClick={handleCreateUser}
                        >
                            Создать
                        </button>
                    )}
                </h1>

                {['user', 'item', 'agreement'].map(tab => (
                    <button
                        key={tab}
                        className={`admin-tabButton ${activeTab === tab ? 'admin-activeTab' : ''}`}
                        onClick={() => handleTabChange(tab)}
                    >
                        {{ user: 'Пользователи', item: 'Инвентарь', agreement: 'Договоры' }[tab]}
                    </button>



                ))}
                {['habitation', 'event'].map(tab => (
                    <button key={tab} className="admin-tabButton admin-inactiveTab" disabled>
                        {{ habitation: 'Проживание', event: 'Мероприятия' }[tab]}
                    </button>
                ))}
                <button className="admin-tabButton admin-logoutButton" onClick={() => navigate('/logout')}>
                    Выйти
                </button>
            </div>

            <div className="admin-content">
                <h1 className="admin-header">{getTabTitle()}</h1>
                {isLoading ? (
                    <div className="admin-loading">
                        <div className="admin-loader"></div>
                        Загрузка данных...
                    </div>
                ) : (
                    renderContent()
                )}
            </div>
            {renderModals()}
        </div>
    );
};

export default AdminPanel;