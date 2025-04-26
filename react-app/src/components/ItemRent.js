import React, {useEffect, useState} from 'react';
import defaultImage from './assets/defaultImage.png';
import {useNavigate} from "react-router-dom";
import logo from "./assets/MountainsLogo.png";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { addDays, isBefore, isAfter, eachDayOfInterval, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

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

    const [currentType, setCurrentType] = useState('items');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [items, setItems] = useState([]);
    const [sumPrice, setSumPrice] = useState(0);
    const [itemPrices, setItemPrices] = useState({});

    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [availability, setAvailability] = useState({});
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

    useEffect(() => {
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        fetch(`http://localhost:8080/api/rental/${currentType}`, { headers })
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
                data.forEach(item => {
                    prices[item.objectID] = item.price;
                });
                setItemPrices(prices);
            })
            .catch(error => {
                console.error('Ошибка загрузки данных:', error);
                alert('Не удалось загрузить данные об объектах');
            });
    }, [currentType]);


    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            (prev + 1) % selectedItem.images.length
        );
    };




    const getAvailability = async (objectId) => {
        setIsLoadingAvailability(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:8080/api/agreement/availability/${objectId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setAvailability(data);
        } catch (error) {
            console.error("Error fetching availability:", error);
            setAvailability({});
        } finally {
            setIsLoadingAvailability(false);
        }
    };

    const isDateDisabled = (date) => {
        const dayStr = format(date, "yyyy-MM-dd");
        return !availability[dayStr]?.available;
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev =>
            (prev - 1 + selectedItem.images.length) % selectedItem.images.length
        );
    };




    const calculateSum = (startDate, endDate, itemId) => {
        if (!startDate || !endDate || !itemPrices[itemId]) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

        const diff = end.getTime() - start.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // Исправлено на Math.ceil

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
        getAvailability(item.id);
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
            // Добавьте проверку на существование selectedItem
            if (selectedItem) {
                const newSum = calculateSum(newData.startDate, newData.endDate, selectedItem.id);
                setSumPrice(newSum);
            }
            return newData;
        });
    };

    const DayComponent = ({ date, selectedDate }) => {
        const dayStr = format(date, "yyyy-MM-dd");
        const isAvailable = availability[dayStr]?.available;

        return (
            <div
                className={`react-datepicker__day ${
                    isAvailable
                        ? "react-datepicker__day--available"
                        : "react-datepicker__day--unavailable"
                }`}
            >
                {date.getDate()}
            </div>
        );
    };

    const handleSubmit = () => {

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = eachDayOfInterval({ start, end });

        const hasUnavailable = days.some(day => {
            const dayStr = format(day, "yyyy-MM-dd");
            return !availability[dayStr]?.available;
        });

        if (hasUnavailable) {
            alert("Выбранные даты содержат недоступные периоды!");
            return;
        }

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
                sumPrice: formData.sumPrice,
                maxCount: formData.maxCount
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        if (text.includes("Предмет кончился!")) {
                            alert("Предмет кончился!");
                            throw new Error("Items dates conflict");
                        } else {
                            throw new Error(`HTTP ${response.status}: ${text}`);
                        }
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
                if (error.message !== "Items dates conflict") {
                    console.error('Error:', error);
                    alert(error.message);
                }
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

            <div className="type-toggle">
                <button
                    className={`type-button ${currentType === 'items' ? 'active' : ''}`}
                    onClick={() => setCurrentType('items')}
                >
                    Предметы
                </button>
                <button
                    className={`type-button ${currentType === 'habitations' ? 'active' : ''}`}
                    onClick={() => setCurrentType('habitations')}
                >
                    Проживание
                </button>
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
                            <div className={`modal-image-section ${currentType === 'habitations' ? 'habitation' : ''}`}>
                                <img
                                    src={selectedItem.images[currentImageIndex]}
                                    alt={selectedItem.text}
                                    className={`modal-image ${currentType === 'habitations' ? 'habitation' : ''}`}
                                />
                                <div className="image-gallery">
                                    {selectedItem.images.length > 1 && (
                                        <button onClick={handlePrevImage} className="nav-button prev">
                                            ←
                                        </button>
                                    )}
                                    {selectedItem.images.length > 1 && (
                                        <button onClick={handleNextImage} className="nav-button next">
                                            →
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="price-badge">
                                Цена за день: {itemPrices[selectedItem.id]} руб.
                            </div>

                            <div className="price-badge">
                                Описание: {selectedItem.objectInfo}
                            </div>
                        </div>

                        <div className="modal-form-section">

                            <div className="rental-input-group">

                                {isLoadingAvailability ? (
                                    <div>Загрузка данных...</div>
                                ) : (
                                    <DatePicker
                                        inline
                                        selectsRange
                                        startDate={formData.startDate ? new Date(formData.startDate) : null}
                                        endDate={formData.endDate ? new Date(formData.endDate) : null}
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            if (start && isDateDisabled(start)) return;
                                            if (end && isDateDisabled(end)) return;
                                            setFormData(prev => {
                                                const newData = {
                                                    ...prev,
                                                    startDate: start ? format(start, "yyyy-MM-dd") : "",
                                                    endDate: end ? format(end, "yyyy-MM-dd") : ""
                                                };

                                                // Добавьте принудительное обновление суммы
                                                if (selectedItem) {
                                                    const newSum = calculateSum(newData.startDate, newData.endDate, selectedItem.id);
                                                    setSumPrice(newSum);
                                                }

                                                return newData;
                                            });
                                        }}
                                        dayClassName={(date) => {
                                            const dayStr = format(date, "yyyy-MM-dd");
                                            return availability[dayStr]?.available
                                                ? "react-datepicker__day--available"
                                                : "react-datepicker__day--unavailable";
                                        }}
                                        renderDayContents={(day, date) => (
                                            <DayComponent date={date} selectedDate={date} />
                                        )}
                                    />
                                )}
                            </div>

                            <div className="date-range-group">
                                <div className="rental-input-group" style={{flex: 1}}>

                                    <input
                                        type="date"
                                        name="startDate"
                                        className="rental-input"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </div>
                                <div className="rental-input-group" style={{flex: 1}}>

                                    <input
                                        type="date"
                                        name="endDate"
                                        className="rental-input"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </div>
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

                            <div className="price-badge">
                                {sumPrice > 0 ? `Сумма аренды: ${sumPrice} ₽` : 'Выберите даты для расчета'}
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