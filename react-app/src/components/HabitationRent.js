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
import "./css/HabitationRent.css";

const HabitationRent = () => {
// Все содержимое ItemRent.js остается тем же, кроме изменения эндпоинтов API
    const [items, setItems] = useState([]);
    useEffect(() => {
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Меняем эндпоинт на habitations
        fetch('http://localhost:8080/api/rental/habitations', { headers })
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
            const newSum = calculateSum(newData.startDate, newData.endDate, selectedItem?.id);
            setSumPrice(newSum);
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
        <div className="habitation-rent-container">
            {/* Меняем классы на habitation-specific */}
            <div className="items-grid">
                {filteredItems.map((item) => (
                    <div key={item.id} className="habitation-card">
                        <img
                            src={item.images[0]}
                            alt={item.text}
                            className="habitation-image"
                        />
                        <h3 className="habitation-title">{item.text}</h3>
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

            {/* Модальное окно и остальные элементы как в ItemRent */}
        </div>
    );
};

export default HabitationRent;