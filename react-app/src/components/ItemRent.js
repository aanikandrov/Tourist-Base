import React, {useEffect, useState} from 'react';
import defaultImage from './assets/defaultImage.png';
import {useNavigate} from "react-router-dom";
import logo from "./assets/MountainsLogo.png";
import "./css/MainPage.css";
import {useAuth} from "../AuthContext";

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

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
            fontFamily: "'Open Sans', sans-serif",
            padding: '2rem',
        },
        topBar: {
            backgroundColor: 'white',
            padding: '1rem 2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '3rem',
            borderRadius: '15px',
        },
        backButton: {
            background: 'linear-gradient(135deg, #3a86ff 0%, #0066ff 100%)',
            color: 'white',
            padding: '0.8rem 2rem',
            borderRadius: '25px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'transform 0.2s',
            ':hover': {
                transform: 'translateY(-2px)',
            },
        },
        itemsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
        },
        itemCard: {
            background: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ':hover': {
                transform: 'translateY(-5px)',
            },
        },
        itemImage: {
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            borderRadius: '10px',
            marginBottom: '1rem',
        },
        itemTitle: {
            fontSize: '1.3rem',
            fontWeight: 600,
            color: '#1a365d',
            marginBottom: '0.5rem',
        },
        priceText: {
            color: '#3a86ff',
            fontSize: '1.1rem',
            fontWeight: 500,
            marginBottom: '1rem',
        },
        detailsButton: {
            background: 'linear-gradient(135deg, #3a86ff 0%, #0066ff 100%)',
            color: 'white',
            padding: '0.8rem 1.5rem',
            borderRadius: '25px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            width: '100%',
            transition: 'opacity 0.3s',
            ':hover': {
                opacity: 0.9,
            },
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '2rem',
            marginRight: '15px',
            width: '700px',
            minHeight: '400px',
            display: 'flex',
            gap: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
        modalHeader: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1a365d',
            marginBottom: '1rem',
            textAlign: 'center',
        },
        modalImage: {
            width: '250px',
            height: '250px',
            objectFit: 'contain',
            borderRadius: '10px',
            margin: '0 auto 1.5rem',
            alignSelf: 'center',
        },
        inputGroup: {
            marginBottom: '1.5rem',
        },
        dateInput: {
            width: '100%',
            padding: '0.8rem',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '1rem',
        },

        label: {
            display: 'block',
            marginBottom: '0.8rem',
            color: '#2d3436',
            fontWeight: 500,
        },
        input: {
            width: '100%',
            padding: '0.8rem',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'border-color 0.3s',
            ':focus': {
                outline: 'none',
                borderColor: '#3a86ff',
            },
        },
        description: {
            textAlign: 'center',
            color: '#2d3436',
            fontSize: '0.9rem',
            marginBottom: '1rem',
        },
        priceBadge: {
            backgroundColor: '#e3f2fd',
            color: '#1a365d',
            padding: '0.5rem 4rem',
            borderRadius: '20px',
            fontWeight: 600,
        },
        totalPrice: {
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#1a365d',
            textAlign: 'center',
            margin: '1.5rem 0',
        },
        modalButtons: {
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
        },
        formSection: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        cancelButton: {
            background: '#e9ecef',
            color: '#2d3436',
            padding: '0.8rem 1.5rem',
            borderRadius: '25px',
            ':hover': {
                background: '#dee2e6',
            },
        },
        submitButton: {
            background: 'linear-gradient(135deg, #3a86ff 0%, #0066ff 100%)',
            color: 'white',
            padding: '0.8rem 1.5rem',
            borderRadius: '25px',
        },
    };

    return (
        <div className="container">

            <div className="topBar">
                <div className="logoContainer">
                    <img src={logo} alt="Логотип Турбазы" className="logo" />
                    <span className="logoText">Турбаза Курсовая</span>
                </div>

                <div className="navButtons">
                    <button
                        className="navButton"
                        onClick={() => navigate('/main')}
                    >
                        Главная
                    </button>
                    <button
                        className="navButton bold"
                        onClick={() => navigate('/itemrent')}
                    >
                        Бронирование
                    </button>
                    <button
                        className="navButton"
                        onClick={() => navigate('/about')}
                    >
                        О нас
                    </button>
                    <button
                        className="navButton"
                        onClick={() => navigate('/info')}
                    >
                        Контакты
                    </button>
                    <button
                        className="navButton dashboardButton"
                        onClick={() => navigate('/userPanel')}
                    >
                        Личный кабинет
                    </button>
                </div>
            </div>


            <div style={{
                maxWidth: '1200px',
                margin: '0 auto 2rem',
                padding: '0 2rem',
                marginTop: '1rem'
            }}>
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e9ecef',
                        borderRadius: '25px',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.3s',
                        ':focus': {
                            borderColor: '#3a86ff'
                        }
                    }}
                />
            </div>

            <div style={styles.itemsGrid}>
                {filteredItems.map((item) => (
                    <div key={item.id} style={styles.itemCard}>
                        <img
                            src={item.images[0]}
                            alt={item.text}
                            style={styles.itemImage}
                        />
                        <h3 style={styles.itemTitle}>{item.text}</h3>
                        <p style={styles.priceText}>Цена за день: {itemPrices[item.id]} ₽</p>
                        <button
                            style={styles.detailsButton}
                            onClick={() => handleOpenModal(item)}
                        >
                            Забронировать
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedItem && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        {/* Левая секция с изображением */}
                        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                            <h2 style={styles.modalHeader}>{selectedItem.text}</h2>

                            {/* Галерея с центрированным изображением */}
                            <div style={{
                                position: 'relative',
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '1rem 0'
                            }}>
                                {selectedItem.images.length > 1 && (
                                    <button
                                        onClick={handlePrevImage}
                                        style={{
                                            position: 'absolute',
                                            left: 10,
                                            padding: '8px 12px',
                                            background: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            zIndex: 2
                                        }}
                                    >
                                        ←
                                    </button>
                                )}

                                <img
                                    src={selectedItem.images[currentImageIndex]}
                                    alt={selectedItem.text}
                                    style={{
                                        ...styles.modalImage,
                                        maxWidth: '100%',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                />

                                {selectedItem.images.length > 1 && (
                                    <button
                                        onClick={handleNextImage}
                                        style={{
                                            position: 'absolute',
                                            right: 10,
                                            padding: '8px 12px',
                                            background: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            zIndex: 2
                                        }}
                                    >
                                        →
                                    </button>
                                )}
                            </div>

                            {/* Цена за день */}
                            <div style={styles.priceBadge}>
                                Цена за день: {itemPrices[selectedItem.id]} руб.
                            </div>
                        </div>

                        {/* Правая секция с формой */}
                        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '250px'}}>
                            {/* Поля ввода дат */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Дата начала:</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    style={{...styles.input, width: '80%'}}
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Дата окончания:</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    style={{...styles.input, width: '80%'}}
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Дополнительная информация:</label>
                                <textarea
                                    name="info"
                                    style={{ ...styles.input, width: '80%', height: '100%', resize: 'none' }}
                                    onChange={handleInputChange}
                                    maxLength={255}
                                    rows={4}
                                />
                            </div>

                            {/* Сумма аренды */}
                            <div style={{
                                padding: '1.3rem',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: '#1a365d'
                            }}>
                                {sumPrice > 0 ? `Сумма аренды: ${sumPrice} ₽` : ''}
                            </div>

                            {/* Кнопки */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end',
                                marginTop: 'auto'
                            }}>
                                <button
                                    style={styles.cancelButton}
                                    onClick={handleCloseModal}
                                >
                                    Отмена
                                </button>
                                <button
                                    style={styles.submitButton}
                                    onClick={handleSubmit}
                                >
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