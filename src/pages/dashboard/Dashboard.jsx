import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaWallet,
    FaMoneyBillWave,
    FaPiggyBank,
    FaHistory,
    FaPlus,
    FaExclamationTriangle
} from 'react-icons/fa';

import { fetchDashboardData } from '../../features/dashboard/DashoboardSlice';
import SummaryCard from '../../components/summeryCard/SummeryCard';
import TransactionItem from '../../components/transactionItems/TransactionItem';
import MonthlyChart from '../../components/charts/monthlyChart/MonthlyChart';
import ExpenseChart from '../../components/charts/expenseChart/ExpenseChart';
import './Dashboard.css';

const Dashboard = () => {
    const dispatch = useDispatch();
    const {
        summary,
        recentTransactions,
        monthlyData,
        loading,
        error
    } = useSelector((state) => state.dashboard);

    const [timeRange, setTimeRange] = useState('monthly');

    // Calculate trends based on actual data (simplified - in real app you'd compare with previous period)
    const trends = useMemo(() => {
        if (!summary) return { income: 0, expense: 0, balance: 0 };

        // Simple trend calculation - you can enhance this with actual comparison logic
        return {
            income: summary.totalIncome > 0 ? 5 : 0, // Placeholder
            expense: summary.totalExpense > 0 ? -3 : 0, // Placeholder
            balance: summary.balance > 0 ? 8 : 0 // Placeholder
        };
    }, [summary]);

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchDashboardData());
    };

    const navigate = useNavigate();

    const handleAddTransaction = useCallback(() => {
        // Navigate to the Add Transaction page
        navigate('/transactions');
    }, [navigate]);

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error-state">
                    <FaExclamationTriangle className="error-icon" />
                    <h3>Unable to load dashboard</h3>
                    <p>{error}</p>
                    <button onClick={handleRefresh} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Financial Dashboard</h1>
                    <p>Welcome back! Here's your financial overview</p>
                </div>
                <div className="header-actions">
                    <button className="add-transaction-btn" onClick={handleAddTransaction}>
                        <FaPlus />
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid">
                <SummaryCard
                    title="Total Balance"
                    amount={summary?.balance || 0}
                    type="balance"
                    icon={<FaWallet />}
                    trend={trends.balance}
                    loading={loading}
                />
                <SummaryCard
                    title="Total Income"
                    amount={summary?.totalIncome || 0}
                    type="income"
                    icon={<FaMoneyBillWave />}
                    trend={trends.income}
                    loading={loading}
                />
                <SummaryCard
                    title="Total Expenses"
                    amount={summary?.totalExpense || 0}
                    type="expense"
                    icon={<FaPiggyBank />}
                    trend={trends.expense}
                    loading={loading}
                />
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                <div className="chart-card main-chart">

                    <MonthlyChart data={monthlyData} loading={loading} />
                </div>

                <div className="chart-card expense-chart">
                    <div className="chart-header">
                        <h3>Expense Breakdown</h3>
                    </div>
                    <ExpenseChart transactions={recentTransactions} loading={loading} />
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="transactions-section">
                <div className="section-header">
                    <h3>
                        <FaHistory /> Recent Transactions
                    </h3>
                    <Link to="/transactions" className="view-all-link">
                        View All
                    </Link>
                </div>
                <div className="transactions-list">
                    {loading ? (
                        // Loading skeletons for transactions
                        Array.from({ length: 3 }).map((_, index) => (
                            <TransactionItem key={index} />
                        ))
                    ) : recentTransactions && recentTransactions.length > 0 ? (
                        recentTransactions.map(transaction => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No transactions yet</p>
                            <button className="add-first-transaction" onClick={handleAddTransaction}>
                                Add Your First Transaction
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;