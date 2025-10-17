import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const SummaryCard = ({ title, amount, type, icon, trend, loading }) => {
    const getTrendColor = () => {
        if (trend > 0) return '#10b981';
        if (trend < 0) return '#ef4444';
        return '#6b7280';
    };

    const getTrendIcon = () => {
        if (trend > 0) return <FaArrowUp className="trend-icon up" />;
        if (trend < 0) return <FaArrowDown className="trend-icon down" />;
        return null;
    };

    if (loading) {
        return (
            <div className="summary-card loading">
                <div className="card-header">
                    <div className="card-icon skeleton"></div>
                    <div className="card-trend skeleton"></div>
                </div>
                <div className="card-content">
                    <h3 className="card-title skeleton"></h3>
                    <p className="card-amount skeleton"></p>
                    <div className="card-subtitle skeleton"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="summary-card">
            <div className="card-header">
                <div className="card-icon">
                    {icon}
                </div>
                <div className="card-trend">
                    {getTrendIcon()}
                    <span style={{ color: getTrendColor() }}>
                        {trend !== 0 && `${Math.abs(trend)}%`}
                    </span>
                </div>
            </div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-amount">₹{amount?.toLocaleString() || '0'}</p>
                <div className="card-subtitle">
                    {type === 'income' ? 'Total Income' : type === 'expense' ? 'Total Expenses' : 'Current Balance'}
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;