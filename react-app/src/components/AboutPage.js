import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';
import landscape from './assets/landscape_3_trim.jpg';
import logo from "./assets/MountainsLogo.png";
import "./css/AboutPage.css";

const AboutPage = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const history = [
        {
            year: "1960",
            event: "Основание турбазы Курсовая как альпинистского лагеря для подготовки советских спортсменов к высокогорным восхождениям."
        },
        {
            year: "1975",
            event: "Реконструкция и расширение инфраструктуры. Построены первые капитальные домики для проживания гостей."
        },
        {
            year: "1991",
            event: "Турбаза становится международным центром альпинизма. Проведение первых коммерческих туров для иностранных гостей."
        },
        {
            year: "2005",
            event: "Модернизация оборудования и создание современного проката альпинистского снаряжения."
        },
        {
            year: "2018",
            event: "Полная реконструкция турбазы с сохранением исторического облика. Открытие нового ресторана с местной кухней."
        },
        {
            year: "2023",
            event: "Турбаза Курсовая получает статус эко-курорта. Внедрение современных технологий для экологичного туризма."
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const image = document.querySelector('.about-header-image');
            const scrollPosition = window.pageYOffset;
            image.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="about-container">
            <div className="top-bar">
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img src={logo} alt="Логотип Турбазы" className="logo-image" />
                    <span className="logo-text">Турбаза Курсовая</span>
                </div>

                <div style={{display: 'flex', gap: '2rem'}}>
                    <button
                        className="nav-button"
                        onClick={() => navigate('/main')}
                    >
                        Главная
                    </button>
                    <button
                        className="nav-button"
                        onClick={() => navigate('/itemrent')}
                    >
                        Бронирование
                    </button>
                    <button
                        className="nav-button"
                        style={{fontWeight: 'bold'}}
                        onClick={() => navigate('/about')}
                    >
                        О нас
                    </button>
                    <button
                        className="nav-button"
                        onClick={() => navigate('/info')}
                    >
                        Контакты
                    </button>
                    <button
                        className="nav-button dashboard-button"
                        onClick={() => navigate('/userPanel')}
                    >
                        {user ? "Личный кабинет" : "Войти"}
                    </button>
                </div>
            </div>

            <header className="about-header">
                <img src={landscape} alt="Горный пейзаж" className="about-header-image" />
                <div className="about-header-content">
                    <h1 className="main-title">Наша история</h1>
                    <p className="subtitle">Более 60 лет в сердце Курсовых гор</p>
                </div>
            </header>

            <section className="history-section">
                <h2 className="section-title">История турбазы Курсовая</h2>

                <div className="timeline">
                    {history.map((item, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-year">{item.year}</div>
                            <div className="timeline-event">{item.event}</div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="contact-footer">
                <h2 className="section-title" style={{color: 'white'}}>Наши контакты</h2>
                <div className="contact-info">
                    <p>Телефон: +9 (999) 999-99-99</p>
                    <p>Почта: info@kursovaya.ru</p>
                    <p>Адрес: Курсовые горы, ул. Курсовая, д. 9</p>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;