import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';

import {
    fetchTransactions,
    deleteTransaction,
    clearError,
    createTransaction,
    updateTransaction,
    fetchCategories
} from '../../features/transaction/TransactionSlice';

import TransactionForm from '../addtransaction/AddTransaction';
import TransactionFilters from '../../components/transactionFilter/TransactionFilter';
import TransactionTable from '../../components/transactionTable/transactionTable';
import ErrorAlert from '../../components/errorAlert/ErrorAleart';
import ShowAlert from '../../components/ShowAlert/ShowAlert';
import './transaction.css';

function Transactions() {
    const dispatch = useDispatch();
    const { transactions, categories, loading, error } = useSelector(state => state.transactions);

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        type: '',
        category: ''
    });
    const [newTransaction, setNewTransaction] = useState({
        amount: '',
        date: '',
        description: '',
        categoryId: '',
    });
    const [showFilters, setShowFilters] = useState(true);

    // Fetch transactions & categories on mount
    useEffect(() => {
        dispatch(fetchTransactions());
        dispatch(fetchCategories());
    }, [dispatch]);

    // Format transactions for table
    const formattedTransactions = useMemo(() => {
        if (!transactions || !Array.isArray(transactions)) return [];
        return transactions.map(transaction => ({
            id: transaction.id,
            date: transaction.date,
            description: transaction.description,
            category: transaction.category_name,
            amount: parseFloat(transaction.amount),
            type: transaction.category_name?.toLowerCase() === 'income' ? 'income' : 'expense',
            status: 'completed',
            rawData: transaction
        }));
    }, [transactions]);

    // Filtered transactions
    const filteredTransactions = useMemo(() => {
        let filtered = formattedTransactions;

        if (filters.startDate) {
            filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(t => new Date(t.date) <= endDate);
        }
        if (filters.type) filtered = filtered.filter(t => t.type === filters.type);
        if (filters.category) {
            filtered = filtered.filter(t =>
                t.category?.toLowerCase().includes(filters.category.toLowerCase())
            );
        }

        return filtered;
    }, [formattedTransactions, filters]);

    // Unique categories for filter dropdown
    const uniqueCategories = useMemo(() => {
        const cats = formattedTransactions.map(t => t.category).filter(Boolean);
        return [...new Set(cats)].sort();
    }, [formattedTransactions]);

    // Handlers
    const handleAddTransaction = () => {
        setNewTransaction({ amount: '', date: '', description: '', categoryId: '' });
        setShowModal(true);
    };

    const handleEditTransaction = useCallback((row) => {
        const originalTransaction = row.rawData;
        setEditingTransaction(originalTransaction);
        setNewTransaction({
            amount: originalTransaction.amount,
            date: originalTransaction.date.split('T')[0],
            description: originalTransaction.description,
            categoryId: originalTransaction.category_id.toString(),
        });
        setShowEditModal(true);
    }, []);

    const handleDeleteTransaction = useCallback(async (row) => {
        if (window.confirm(`Are you sure you want to delete "${row.description}"?`)) {
            try {
                await dispatch(deleteTransaction(row.id)).unwrap();
                ShowAlert('Transaction deleted successfully!', 'success');
                dispatch(fetchTransactions());
            } catch (error) {
                console.error('Error deleting transaction:', error);
                ShowAlert('Failed to delete transaction', 'error');
            }
        }
    }, [dispatch]);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters({ startDate: '', endDate: '', type: '', category: '' });
    }, []);

    const handleChange = useCallback((key, value) => {
        setNewTransaction(prev => ({ ...prev, [key]: value }));
    }, []);

    // Save (Add) Transaction
    const handleSaveTransaction = async () => {
        const { amount, date, description, categoryId } = newTransaction;

        if (!amount || !date || !description || !categoryId) {
            ShowAlert('Please fill all fields', 'warning');
            return;
        }

        try {
            await dispatch(createTransaction({
                amount: parseFloat(amount),
                date,
                description,
                categoryId: parseInt(categoryId)
            })).unwrap();

            setShowModal(false);
            setNewTransaction({ amount: '', date: '', description: '', categoryId: '' });
            dispatch(fetchTransactions());

            ShowAlert('Transaction added successfully!', 'success');
        } catch (error) {
            console.error('Error adding transaction:', error);
            ShowAlert('Failed to add transaction', 'error');
        }
    };

    // Update Transaction
    const handleUpdateTransaction = async () => {
        const { amount, date, description, categoryId } = newTransaction;
        if (!amount || !date || !description || !categoryId) {
            ShowAlert('Please fill all fields', 'warning');
            return;
        }

        try {
            await dispatch(updateTransaction({
                id: editingTransaction.id,
                transactionData: {
                    amount: parseFloat(amount),
                    date,
                    description,
                    categoryId: parseInt(categoryId)
                }
            })).unwrap();

            setShowEditModal(false);
            setEditingTransaction(null);
            setNewTransaction({ amount: '', date: '', description: '', categoryId: '' });
            dispatch(fetchTransactions());

            ShowAlert('Transaction updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating transaction:', error);
            ShowAlert('Failed to update transaction', 'error');
        }
    };

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const hasActiveFilters = Object.values(filters).some(Boolean);

    return (
        <div className="transactions-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Transactions</h1>
                    <p className="page-subtitle">Manage and track your financial transactions</p>
                </div>
                <button className="btn-primary" onClick={handleAddTransaction}>
                    <FaPlus className="me-2" /> Add Transaction
                </button>
            </div>

            {/* Error Alert */}
            <ErrorAlert error={error} onClear={handleClearError} />

            {/* Filters */}
            <TransactionFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
                uniqueCategories={uniqueCategories}
            />

            {/* Results Info */}
            <div className="results-info">
                Showing {filteredTransactions.length} of {formattedTransactions.length} transactions
                {hasActiveFilters && ' (filtered)'}
            </div>

            {/* Transactions Table */}
            <TransactionTable
                transactions={filteredTransactions}
                loading={loading}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
            />

            {/* Add Transaction Modal */}
            <TransactionForm
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                transaction={newTransaction}
                onChange={handleChange}
                onSave={handleSaveTransaction}
                title="Add New Transaction"
                categories={categories}
            />

            {/* Edit Transaction Modal */}
            <TransactionForm
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingTransaction(null);
                    setNewTransaction({ amount: '', date: '', description: '', categoryId: '' });
                }}
                transaction={newTransaction}
                onChange={handleChange}
                onSave={handleUpdateTransaction}
                title="Edit Transaction"
                categories={categories}
                isEditing={true}
            />
        </div>
    );
}

export default Transactions;
