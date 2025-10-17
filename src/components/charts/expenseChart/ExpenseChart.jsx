import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const ExpenseChart = ({ transactions, loading }) => {
    const expenseData = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return {
                labels: ['No Data'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e5e7eb'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            };
        }

        const categories = {};
        transactions
            .filter(t => t.category_name.toLowerCase() === 'expense')
            .forEach(t => {
                categories[t.description] = (categories[t.description] || 0) + parseFloat(t.amount);
            });

        // If no expenses, show placeholder
        if (Object.keys(categories).length === 0) {
            return {
                labels: ['No Expenses'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e5e7eb'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            };
        }

        return {
            labels: Object.keys(categories),
            datasets: [
                {
                    data: Object.values(categories),
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6',
                        '#8b5cf6',
                        '#ec4899',
                        '#06b6d4',
                        '#84cc16'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }
            ]
        };
    }, [transactions]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return `${label}: $${value.toLocaleString()}`;
                    }
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="chart-container loading">
                <div className="chart-skeleton"></div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <Doughnut data={expenseData} options={options} />
        </div>
    );
};

export default ExpenseChart;