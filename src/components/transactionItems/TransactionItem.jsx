import React from 'react';
import {
    FaMoneyBillWave,
    FaShoppingCart,
    FaUtensils,
    FaCar,
    FaHome,
    FaChartLine,
    FaPiggyBank,
    FaQuestionCircle
} from 'react-icons/fa';

const TransactionItem = ({ transaction }) => {
    const getCategoryIcon = (category) => {
        const icons = {
            Income: <FaMoneyBillWave />,
            Expense: <FaShoppingCart />,
            Food: <FaUtensils />,
            Transport: <FaCar />,
            Rent: <FaHome />,
            Entertainment: <FaShoppingCart />,
            Salary: <FaMoneyBillWave />,
            Freelance: <FaChartLine />,
            Bonus: <FaPiggyBank />
        };
        // Return the matched icon or default if not found
        return icons[category] || <FaQuestionCircle />;
    };

    const getAmountColor = () => {
        return transaction.category_name === 'Income' ? 'amount-income' : 'amount-expense';
    };

    const getAmountSign = () => {
        return transaction.category_name === 'Income' ? '+' : '-';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!transaction) {
        return (
            <div className="transaction-item loading">
                <div className="transaction-icon skeleton"></div>
                <div className="transaction-details">
                    <div className="transaction-title skeleton"></div>
                    <div className="transaction-category skeleton"></div>
                </div>
                <div className="transaction-amount skeleton"></div>
            </div>
        );
    }

    return (
        <div className="transaction-item">
            <div className={`transaction-icon ${transaction.category_name?.toLowerCase()}`}>
                {getCategoryIcon(transaction.category_name)}
            </div>
            <div className="transaction-details">
                <div className="transaction-title">
                    {transaction.description}
                </div>
                <div className="transaction-category">
                    {transaction.category_name || 'Unknown'} • {formatDate(transaction.transaction_date)}
                </div>
            </div>
            <div className={`transaction-amount ${getAmountColor()}`}>
                {getAmountSign()}₹{parseFloat(transaction.amount).toLocaleString()}
            </div>
        </div>
    );
};

export default TransactionItem;
