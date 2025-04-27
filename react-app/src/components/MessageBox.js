import React from 'react';
import './css/MessageBox.css';

export const MessageBox = ({ message, type = 'info', onClose, children }) => {
    return (
        <div className={`message-box ${type}`}>
            <div className="message-content">
                {message}
                {children}
                <button className="close-button" onClick={onClose}>×</button>
            </div>
        </div>
    );
}