import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './AddTransaction.css';
const TransactionForm = ({
    isOpen,
    onClose,
    transaction,
    onChange,
    onSave,
    title,
    categories,
    isEditing = false
}) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={transaction.amount}
                            onChange={(e) => onChange('amount', e.target.value)}
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="transaction_date">Date</label>
                        <input
                            id="transaction_date"
                            type="date"
                            value={transaction.transaction_date}
                            onChange={(e) => onChange('transaction_date', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            id="description"
                            type="text"
                            value={transaction.description}
                            onChange={(e) => onChange('description', e.target.value)}
                            placeholder="Enter description"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoryId">Category</label>
                        <select
                            id="categoryId"
                            value={transaction.categoryId}
                            onChange={(e) => onChange('categoryId', e.target.value)}
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>

                <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary" onClick={onSave}>
                        {isEditing ? 'Update' : 'Save'} Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionForm;