// src/components/loading/LoadingSpinner.jsx
import React from 'react';
import './loadingSpiner.css';

const LoadingSpinner = ({
    size = 'medium',
    variant = 'primary',
    className = '',
    overlay = false,
    text = 'Loading...',
    showText = true
}) => {
    const spinnerClass = `
    loading-spinner
    loading-spinner--${size}
    loading-spinner--${variant}
    ${overlay ? 'loading-spinner--overlay' : ''}
    ${className}
  `.trim();

    return (
        <div className={spinnerClass}>
            <div className="loading-spinner__container">
                <div className="loading-spinner__animation">
                    <div className="loading-spinner__dot"></div>
                    <div className="loading-spinner__dot"></div>
                    <div className="loading-spinner__dot"></div>
                </div>
                {showText && text && (
                    <div className="loading-spinner__text">
                        {text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadingSpinner;