import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { MessageBox } from './MessageBox';

import AdminLayout from './AdminLayout';
import './css/AdminPanel.css';


const AdminPanelForItems = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [content, setContent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [newItemData, setNewItemData] = useState({
        objectName: '',
        price: '',
        objectInfo: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const filteredObjects = content.filter(item =>
        item.objectName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/rental/items', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setContent(response.data);
        } catch (error) {
            console.error('Ошибка загрузки инвентаря:', error);
            showMessage("Ошибка загрузки инвентаря", 'error');
            setContent([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateItem = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewItemData({
            objectName: '',
            price: '',
            objectInfo: ''
        });
    };

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info');

    const showMessage = (text, type = 'info') => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(null), 5000);
    };

    const handleCreateSubmit = async () => {
        try {
            await axios.post('/api/rental/items', newItemData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchData();
            handleCloseCreateModal();
            showMessage("Предмет успешно создан", 'success');
        } catch (error) {
            console.error('Ошибка создания:', error);
            showMessage("Не удалось создать предмет", 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/rental/${editData.objectID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            fetchData();
            handleCloseItemModal();
            showMessage("Предмет успешно удалён", 'success');
        } catch (error) {
            console.error('Ошибка удаления:', error);
            showMessage("Не удалось удалить предмет", 'error');
        }
    };

    const handleItemDetails = (item) => {
        setEditData(item);
        setIsItemModalOpen(true);
    };

    const handleCloseItemModal = () => {
        setIsItemModalOpen(false);
        setEditData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/rental/${editData.objectID}`, {
                objectName: editData.objectName,
                price: editData.price,
                objectInfo: editData.objectInfo
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            fetchData();
            handleCloseItemModal();
            showMessage("Изменения успешно сохранены", 'success');
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            showMessage("Не удалось сохранить изменения", 'error');
        }
    };

    const renderItemContent = (item) => (
        <div key={item.objectID} className="admin-card">
            <div className="admin-listItem admin-flexItem">
                <div className="admin-itemInfo">
                    <strong>ID:</strong> {item.objectID} &nbsp;|&nbsp;
                    <strong>Название:</strong> {item.objectName} &nbsp;|&nbsp;
                    <strong>Цена:</strong> {item.price}
                </div>
                <button className="admin-editButton" onClick={() => handleItemDetails(item)}>
                    Подробнее
                </button>
            </div>
        </div>
    );

    return (
        <AdminLayout
            activeTab="item"
            headerTitle="Инвентарь"
            showCreateButton
            onCreate={handleCreateItem}
        >
            <div className="admin-search-container">
                <input
                    type="text"
                    placeholder="Поиск по названию предмета..."
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
                filteredObjects.map(renderItemContent)
            )}



            {isCreateModalOpen && (
                <div className="admin-modalOverlay">
                    <div className="admin-modalContent">



                        <h2 className="admin-modalHeader">Создание нового инвентаря</h2>
                        <div className="admin-inputGroup">
                            <label>Название:</label>
                            <input
                                name="objectName"
                                value={newItemData.objectName}
                                onChange={(e) => setNewItemData({...newItemData, objectName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Цена:</label>
                            <input
                                type="number"
                                name="price"
                                value={newItemData.price}
                                onChange={(e) => setNewItemData({...newItemData, price: e.target.value})}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Описание:</label>
                            <textarea
                                name="objectInfo"
                                value={newItemData.objectInfo}
                                onChange={(e) => setNewItemData({...newItemData, objectInfo: e.target.value})}
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

            {isItemModalOpen && (
                <div className="admin-modalOverlay">
                    <div className="admin-modalContent">
                        <h2 className="admin-modalHeader">Редактирование инвентаря #{editData.objectID}</h2>
                        <div className="admin-inputGroup">
                            <label>Название:</label>
                            <input
                                name="objectName"
                                value={editData.objectName || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="admin-inputGroup">
                            <label>Цена:</label>
                            <input
                                type="number"
                                name="price"
                                value={editData.price || ''}
                                onChange={handleInputChange}
                                required
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
                        <div className="admin-modalButtons">
                            <button
                                className="admin-deleteButton"
                                onClick={handleDelete}
                                style={{backgroundColor: '#ff4444', marginLeft: 'auto'}}
                            >
                                Удалить
                            </button>
                            <button className="admin-cancelButton" onClick={handleCloseItemModal}>
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

export default AdminPanelForItems;