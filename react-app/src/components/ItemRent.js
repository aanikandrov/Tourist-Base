import React, {useEffect, useState} from 'react';
import defaultImage from './assets/defaultImage.png';
import {useNavigate} from "react-router-dom";
import logo from "./assets/MountainsLogo.png";

import {useAuth} from "../AuthContext";

import "./css/MainPage.css";
import "./css/UserDesign.css";
import "./css/ItemRent.css";

const ItemRent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        info: ''
    });
    const navigate = useNavigate();
    const {user} = useAuth();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [items, setItems] = useState([]);
    const [sumPrice, setSumPrice] = useState(0);
    const [itemPrices, setItemPrices] = useState({});

    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            (prev + 1) % selectedItem.images.length
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev =>
            (prev - 1 + selectedItem.images.length) % selectedItem.images.length
        );
    };


    useEffect(() => {
        fetch('http://localhost:8080/api/rental/items', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const itemsWithImages = data.map((item) => ({
                    id: item.objectID,
                    text: item.objectName,
                    buttonText: 'Забронировать',
                    image: item.imagePath ? `${process.env.PUBLIC_URL}/assets/${item.imagePath}` : defaultImage,
                    objectInfo: item.objectInfo,
                    images: item.imagePaths?.length > 0
                        ? item.imagePaths.map(path => require(`./assets/${path}`))
                        : [defaultImage]
                }));
                setItems(itemsWithImages);

                const prices = {};
                data.forEach(item => prices[item.objectID] = item.price);
                setItemPrices(prices);
            })
            .catch(error => {
                console.error('Ошибка загрузки данных:', error);
                alert('Не удалось загрузить данные об объектах');
            });
    }, []);

    const calculateSum = (startDate, endDate, itemId) => {
        if (!startDate || !endDate || !itemPrices[itemId]) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = end.getTime() - start.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

        return days * itemPrices[itemId];
    };

    const handleOpenModal = (item) => {
        if (!user || user.userRole === 'GUEST') {
            navigate('/login');
            return;
        }

        setCurrentImageIndex(0);
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({startDate: '', endDate: '', info: ''});
        setSumPrice(0);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => {
            const newData = {...prev, [name]: value};
            const newSum = calculateSum(newData.startDate, newData.endDate, selectedItem?.id);
            setSumPrice(newSum);
            return newData;
        });
    };

    const handleSubmit = () => {
        fetch('http://localhost:8080/api/agreement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                objectID: selectedItem?.id,
                timeBegin: formData.startDate,
                timeEnd: formData.endDate,
                agreementInfo: formData.info,
                sumPrice: formData.sumPrice
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                handleCloseModal();
                alert('Бронирование успешно создано!');
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`Ошибка: ${error.message}`);
            });
    };

    return (
        <div className="item-rent-container">
            <div className="top-bar">
                <div className="logo-container">
                    <img src={logo} alt="Логотип Турбазы" className="logo" />
                    <span className="logo-text">Турбаза Курсовая</span>
                </div>

                <div className="nav-buttons">
                    <button className="navButton" onClick={() => navigate('/main')}>
                        Главная
                    </button>
                    <button className="navButton bold" onClick={() => navigate('/itemrent')}>
                        Бронирование
                    </button>
                    <button className="navButton" onClick={() => navigate('/about')}>
                        О нас
                    </button>
                    <button className="navButton" onClick={() => navigate('/info')}>
                        Контакты
                    </button>
                    <button className="navButton dashboardButton" onClick={() => navigate('/userPanel')}>
                        Личный кабинет
                    </button>
                </div>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="items-grid">
                {filteredItems.map((item) => (
                    <div key={item.id} className="item-card">
                        <img
                            src={item.images[0]}
                            alt={item.text}
                            className="item-image"
                        />
                        <h3 className="item-title">{item.text}</h3>
                        <p className="price-text">Цена за день: {itemPrices[item.id]} ₽</p>
                        <button
                            className="details-button"
                            onClick={() => handleOpenModal(item)}
                        >
                            Забронировать
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedItem && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-image-section">
                            <h2 className="modal-header">{selectedItem.text}</h2>

                            <div className="image-gallery">
                                {selectedItem.images.length > 1 && (
                                    <button
                                        onClick={handlePrevImage}
                                        className="nav-button prev"
                                    >
                                        ←
                                    </button>
                                )}

                                <img
                                    src={selectedItem.images[currentImageIndex]}
                                    alt={selectedItem.text}
                                    className="modal-image"
                                />

                                {selectedItem.images.length > 1 && (
                                    <button
                                        onClick={handleNextImage}
                                        className="nav-button next"
                                    >
                                        →
                                    </button>
                                )}
                            </div>

                            <div className="price-badge">
                                Цена за день: {itemPrices[selectedItem.id]} руб.
                            </div>
                        </div>

                        <div className="modal-form-section">
                            <div className="rental-input-group">
                                <label>Дата начала:</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    className="rental-input"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="rental-input-group">
                                <label>Дата окончания:</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    className="rental-input"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="rental-input-group">
                                <label>Дополнительная информация:</label>
                                <textarea
                                    name="info"
                                    className="rental-input textarea"
                                    onChange={handleInputChange}
                                    maxLength={255}
                                    rows={4}
                                />
                            </div>

                            <div className="total-price">
                                {sumPrice > 0 ? `Сумма аренды: ${sumPrice} ₽` : ''}
                            </div>

                            <div className="modal-buttons">
                                <button className="cancel-button" onClick={handleCloseModal}>
                                    Отмена
                                </button>
                                <button className="save-button" onClick={handleSubmit}>
                                    Подтвердить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemRent;