import React from 'react';
import { MessageBox } from './MessageBox';
import './css/ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirm-dialog-wrapper">
            <MessageBox
                message={message}
                type="info"
                onClose={onCancel}
            >
                <div className="confirm-buttons">
                    <button className="confirm-button" onClick={onConfirm}>Да</button>
                    <button className="cancel-button" onClick={onCancel}>Нет</button>
                </div>
            </MessageBox>
        </div>
    );
};

export default ConfirmDialog;