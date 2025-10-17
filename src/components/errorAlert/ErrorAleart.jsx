import React from 'react';

const ErrorAlert = ({ error, onClear }) => {
    if (!error) return null;

    return (
        <div className="error-alert">
            <div className="error-content">
                <strong>Error:</strong> {error.message || error.toString()}
            </div>
            <button className="error-close" onClick={onClear}>
                ×
            </button>
        </div>
    );
};

export default ErrorAlert;