// AdminLayout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/AdminPanel.css';

const AdminLayout = ({ children, activeTab, headerTitle, showCreateButton, onCreate }) => {
    const navigate = useNavigate();

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <h2 className="admin-sidebarTitle">Админ-панель</h2>
                {['user', 'item', 'agreement'].map(tab => (
                    <button
                        key={tab}
                        className={`admin-tabButton ${activeTab === tab ? 'admin-activeTab' : ''}`}
                        onClick={() => navigate(`/admin/${tab}s`)}
                    >
                        {{ user: 'Пользователи', item: 'Инвентарь', agreement: 'Договоры' }[tab]}
                    </button>
                ))}
                <button className="admin-tabButton admin-logoutButton" onClick={() => navigate('/logout')}>
                    Выйти
                </button>
            </div>

            <div className="admin-content">
                <h1 className="admin-header">
                    {headerTitle}
                    {showCreateButton && (
                        <button
                            className="admin-editButton"
                            style={{marginLeft: '1rem'}}
                            onClick={onCreate}
                        >
                            Создать
                        </button>
                    )}
                </h1>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;