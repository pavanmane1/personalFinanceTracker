import React from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const TransactionFilters = ({
    filters,
    onFilterChange,
    onClearFilters,
    showFilters,
    onToggleFilters,
    uniqueCategories
}) => {
    const hasActiveFilters = Object.values(filters).some(Boolean);

    return (
        <div className="filter-section">
            <div className="filter-card">
                <div className="filter-header">
                    <div className="filter-title">
                        <FaFilter className="filter-icon" />
                        <h6>Filter Transactions</h6>
                    </div>
                    <div className="filter-buttons">
                        {hasActiveFilters && (
                            <button className="btn-clear" onClick={onClearFilters}>
                                <FaTimes className="me-1" />
                                Clear All
                            </button>
                        )}
                        <button className="btn-toggle" onClick={onToggleFilters}>
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="filter-body">
                        <div className="filter-grid">
                            <div className="filter-item">
                                <label htmlFor="startDate">Start Date</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={filters.startDate}
                                    onChange={e => onFilterChange('startDate', e.target.value)}
                                />
                            </div>
                            <div className="filter-item">
                                <label htmlFor="endDate">End Date</label>
                                <input
                                    id="endDate"
                                    type="date"
                                    value={filters.endDate}
                                    onChange={e => onFilterChange('endDate', e.target.value)}
                                />
                            </div>

                            <div className="filter-item">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    value={filters.category}
                                    onChange={e => onFilterChange('category', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {uniqueCategories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="active-filters">
                                <span className="active-title">Active Filters:</span>
                                {filters.startDate && (
                                    <span className="badge">
                                        From: {new Date(filters.startDate).toLocaleDateString()}
                                    </span>
                                )}
                                {filters.endDate && (
                                    <span className="badge">
                                        To: {new Date(filters.endDate).toLocaleDateString()}
                                    </span>
                                )}
                                {filters.category && (
                                    <span className="badge">Category: {filters.category}</span>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionFilters;