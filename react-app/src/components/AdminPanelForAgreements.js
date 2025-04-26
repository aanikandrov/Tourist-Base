import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './css/AdminPanel.css';

const AdminPanelForAgreements = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [content, setContent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [newAgreementData, setNewAgreementData] = useState({
        userID: '',
        objectID: '',
        timeBegin: '',
        timeEnd: '',
        agreementInfo: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/agreement/admin/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setContent(response.data);
        } catch (error) {
            console.error('Ошибка загрузки договоров:', error);
            alert('Не удалось загрузить данные договоров');
            setContent([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateAgreement = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewAgreementData({
            userID: '',
            objectID: '',
            timeBegin: '',
            timeEnd: '',
            agreementInfo: ''
        });
    };

    const handleDeleteAgreement = async () => {
        try {
            await axios.delete(`/api/agreement/${editData.agreementID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchData();
            handleCloseAgreementModal();
            alert('Договор успешно удален!');
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Не удалось удалить договор');
        }
    };

    const handleCreateSubmit = async () => {
        try {
            await axios.post('/api/agreement', newAgreementData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchData();
            handleCloseCreateModal();
            alert('Договор успешно создан!');
        } catch (error) {
            console.error('Ошибка создания:', error);
            alert('Не удалось создать договор');
        }
    };

    const handleAgreementDetails = (agreement) => {
        setEditData(agreement);
        setIsAgreementModalOpen(true);
    };

    const handleCloseAgreementModal = () => {
        setIsAgreementModalOpen(false);
        setEditData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/agreement/${editData.agreementID}`, {
                timeBegin: editData.timeBegin,
                timeEnd: editData.timeEnd,
                agreementInfo: editData.agreementInfo
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            fetchData();
            handleCloseAgreementModal();
            alert('Изменения успешно сохранены!');
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Не удалось сохранить изменения');
        }
    };

    const renderAgreementContent = (item) => (
        <div key={item.agreementID} className="admin-card">
            <div className="admin-listItem admin-flexItem">
                <div className="admin-agreementInfo">
                    <strong>ID:</strong> {item.agreementID} &nbsp;|&nbsp;
                    <strong>Пользователь:</strong> {item.userID} &nbsp;|&nbsp;
                    <strong>Инвентарь:</strong> {item.objectID} &nbsp;|&nbsp;
                    <strong>Период:</strong> {new Date(item.timeBegin).toLocaleDateString()} - {new Date(item.timeEnd).toLocaleDateString()}
                </div>
                <button className="admin-editButton" onClick={() => handleAgreementDetails(item)}>
                    Подробнее
                </button>
            </div>
        </div>
    );

    return (
        <AdminLayout
            activeTab="agreement"
            headerTitle="Все договоры"
            showCreateButton
            onCreate={handleCreateAgreement}
        >
            {isLoading ? (
                <div className="admin-loading">
                    <div className="admin-loader"></div>
                    Загрузка данных...
                </div>
            ) : (
                content.map(renderAgreementContent)
            )}

            {isCreateModalOpen && (
                <div className="admin-modalOverlay">
                    <div className="admin-modalContent">
                        <h2 className="admin-modalHeader">Создание нового договора</h2>
                        <div className="admin-inputGroup">
                            <label>ID пользователя:</label>
                            <input
                                type="number"
                                name="userID"
                                value={newAgreementData.userID}
                                onChange={(e) => setNewAgreementData({...newAgreementData, userID: e.target.value})}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>ID инвентаря:</label>
                            <input
                                type="number"
                                name="objectID"
                                value={newAgreementData.objectID}
                                onChange={(e) => setNewAgreementData({...newAgreementData, objectID: e.target.value})}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Дата начала:</label>
                            <input
                                type="date"
                                name="timeBegin"
                                value={newAgreementData.timeBegin}
                                onChange={(e) => setNewAgreementData({...newAgreementData, timeBegin: e.target.value})}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Дата окончания:</label>
                            <input
                                type="date"
                                name="timeEnd"
                                value={newAgreementData.timeEnd}
                                onChange={(e) => setNewAgreementData({...newAgreementData, timeEnd: e.target.value})}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Комментарий:</label>
                            <textarea
                                name="agreementInfo"
                                value={newAgreementData.agreementInfo}
                                onChange={(e) => setNewAgreementData({...newAgreementData, agreementInfo: e.target.value})}
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

            {isAgreementModalOpen && (
                <div className="admin-modalOverlay">
                    <div className="admin-modalContent">
                        <h2 className="admin-modalHeader">Редактирование договора #{editData.agreementID}</h2>
                        <div className="admin-inputGroup">
                            <label>Дата начала:</label>
                            <input
                                type="date"
                                name="timeBegin"
                                value={editData.timeBegin?.split('T')[0] || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Дата окончания:</label>
                            <input
                                type="date"
                                name="timeEnd"
                                value={editData.timeEnd?.split('T')[0] || ''}
                                onChange={handleInputChange}
                                required
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
                        <div className="admin-modalButtons">
                            <button
                                className="admin-deleteButton"
                                onClick={handleDeleteAgreement}
                                style={{ backgroundColor: '#ff4444', marginLeft: 'auto' }}
                            >
                                Удалить
                            </button>

                            <button className="admin-cancelButton" onClick={handleCloseAgreementModal}>
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

export default AdminPanelForAgreements;