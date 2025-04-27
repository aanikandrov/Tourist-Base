import React from 'react';
import landscape from './assets/landscape_2.jpg';
import {Navigate, useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';
import logo from "./assets/MountainsLogo.png";

import "./css/MainPage.css";
import "./css/MainDesign.css";

const MainPage = () => {
    const {user, logout, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return <div>Loading...</div>;

    if (user && user.userRole === 'ADMIN' ) {
        return <Navigate to="/admin/users" replace />;
    }

    const handleDashboardClick = () => {
        if (!user) {
            navigate('/login');
        } else if (user.userRole === 'USER') {
            navigate('/userPanel');
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
                    <button
                        className="nav-button bold"
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
                        onClick={handleDashboardClick}
                    >
                        {user ? "Личный кабинет" : "Войти"}
                    </button>
                </div>
            </div>

            <header className="main-header">
                <img src={landscape} alt="Горный пейзаж" className="headerImage" />
                <div className="headerContent">
                    <h1 className="mainTitle">Открой для себя горы</h1>

                </div>
            </header>

            <section className="servicesSection">
                <h2 className="sectionTitle servicesTitle">
                    Наши услуги
                </h2>
                <div className="featuresGrid">
                    <div className="service-card">
                        <h3 className="serviceTitle">Инвентарь</h3>
                        <p>Профессиональное снаряжение для альпинизма и туризма</p>
                    </div>
                    <div className="service-card">
                        <h3 className="serviceTitle">Проживание</h3>
                        <p>Кемпинг и уютные домики с видом на горные вершины</p>
                    </div>
                    <div className="service-card">
                        <h3 className="serviceTitle">Походы</h3>
                        <p>Организованные туры с опытными гидами</p>
                    </div>
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

export default MainPage;