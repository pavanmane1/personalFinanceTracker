import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const MonthlyChart = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="chart-container loading">
                <div className="chart-skeleton"></div>
            </div>
        );
    }

    if (!data || !data.labels || !data.income || !data.expenses) {
        return (
            <div className="chart-container no-data">
                <p>No chart data available</p>
            </div>
        );
    }

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Income',
                data: data.income,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Expenses',
                data: data.expenses,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Income vs Expenses'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="chart-container">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default MonthlyChart;