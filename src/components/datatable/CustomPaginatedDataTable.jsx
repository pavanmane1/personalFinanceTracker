import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import './CustomPaginatedDataTable.css'// We'll create this CSS file

const TableRow = React.memo(({ row, rowIndex, columns, actions, currentPage, itemsPerPage, onCellChange }) => {
    return (
        <tr key={row.id || rowIndex} className="table-row">
            <td className="serial-number">
                {(currentPage - 1) * itemsPerPage + rowIndex + 1}
            </td>
            {columns.map((col, colIndex) => (
                <td
                    key={colIndex}
                    className="table-cell"
                    style={{
                        minWidth: col.minWidth || '120px',
                        maxWidth: col.maxWidth || '300px'
                    }}
                >
                    {col.render ?
                        col.render(
                            row[col.key],
                            row,
                            (value) => onCellChange(rowIndex, col.key, value)
                        ) :
                        <span className="cell-content">{row[col.key]}</span>
                    }
                </td>
            ))}
            {actions.length > 0 && (
                <td className="actions-cell">
                    <div className="actions-container">
                        {actions.map((action, actionIndex) => (
                            <button
                                key={actionIndex}
                                className={`action-btn ${action.disabled?.(row) ? 'disabled' : ''}`}
                                title={action.disabled?.(row) ? 'Action not allowed' : action.title || ''}
                                onClick={() => {
                                    if (!action.disabled?.(row)) {
                                        action.onClick(row);
                                    }
                                }}
                                disabled={action.disabled?.(row)}
                            >
                                {action.icon}
                            </button>
                        ))}
                    </div>
                </td>
            )}
        </tr>
    );
});

const CustomPaginatedDataTable = ({
    columns = [],
    data = [],
    actions = [],
    itemsPerPage = 10,
    detailAddButton,
    searchFields = null,
    isDetailAddButton = false,
    onDataChange = () => { }
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 576);
    const tableContainerRef = useRef(null);

    // Helper function to get nested values
    const getNestedValue = (obj, path) => {
        if (!path) return undefined;
        return path.split('.').reduce((o, p) => (o !== null && o !== undefined) ? o[p] : undefined, obj);
    };

    // Filtered data calculation
    const filteredData = useMemo(() => {
        if (!searchQuery) return data;

        const query = searchQuery.toLowerCase().trim();

        return data.filter(row => {
            const activeFields = searchFields?.length > 0
                ? searchFields
                : columns
                    .filter(col => col.searchable !== false)
                    .map(col => col.searchBy || col.key);

            return activeFields.some(field => {
                try {
                    const value = getNestedValue(row, field);
                    return String(value || '').toLowerCase().includes(query);
                } catch (e) {
                    console.warn(`Error searching field ${field}:`, e);
                    return false;
                }
            });
        });
    }, [data, searchQuery, searchFields, columns]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = useMemo(() =>
        filteredData.slice(startIndex, startIndex + itemsPerPage),
        [filteredData, startIndex, itemsPerPage]
    );

    // Responsive handling
    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 576);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Pagination
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1) pageNumber = 1;
        if (pageNumber > totalPages) pageNumber = totalPages;
        setCurrentPage(pageNumber);
    };

    // Search with debounce
    const handleSearch = useCallback(
        debounce((value) => {
            setSearchQuery(value);
            setCurrentPage(1);
        }, 300),
        []
    );

    // Generate pagination items
    const paginationItems = useMemo(() => {
        const items = [];
        const maxVisiblePages = isMobileView ? 5 : 7;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(i);
        }

        return items;
    }, [isMobileView, currentPage, totalPages]);

    // Handle cell changes
    const handleCellChange = useCallback((rowIndex, colKey, value) => {
        const actualIndex = startIndex + rowIndex;
        if (actualIndex < 0 || actualIndex >= data.length) return;

        const updatedData = [...data];
        updatedData[actualIndex] = {
            ...updatedData[actualIndex],
            [colKey]: value
        };

        onDataChange(updatedData);
    }, [data, startIndex, onDataChange]);

    // Calculate totals
    const totals = useMemo(() => {
        const result = {};

        columns.forEach(col => {
            if (col.isSumable) {
                result[col.key] = data.reduce((sum, row) => {
                    const value = parseFloat(row[col.key]) || 0;
                    return sum + value;
                }, 0);
            }
        });

        return result;
    }, [columns, data]);

    return (
        <div className="custom-table-container">
            {/* Header Section */}
            <div className="table-header">
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        onChange={(e) => handleSearch(e.target.value)}
                        aria-label="Search"
                    />
                </div>
            </div>

            {/* Table Container */}
            <div
                ref={tableContainerRef}
                className="table-wrapper"
            >
                <table className="custom-table">
                    <thead>
                        <tr className="table-header-row">
                            <th className="serial-header">Sr No</th>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="column-header"
                                    style={{
                                        minWidth: col.minWidth || '120px',
                                        maxWidth: col.maxWidth || '300px'
                                    }}
                                >
                                    <span className="header-text">{col.header}</span>
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="actions-header">Actions</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((row, rowIndex) => (
                                <TableRow
                                    key={row.id || rowIndex}
                                    row={row}
                                    rowIndex={rowIndex}
                                    columns={columns}
                                    actions={actions}
                                    currentPage={currentPage}
                                    itemsPerPage={itemsPerPage}
                                    onCellChange={handleCellChange}
                                />
                            ))
                        ) : (
                            <tr className="no-data-row">
                                <td
                                    colSpan={columns.length + (actions.length > 0 ? 2 : 1)}
                                    className="no-data-cell"
                                >
                                    No data found
                                </td>
                            </tr>
                        )}

                        {/* Total Row */}
                        {(columns.some(col => col.isSumable)) && (
                            <tr className="total-row">
                                <td className="total-label">Total</td>
                                {columns.map((col, index) => (
                                    <td
                                        key={index}
                                        className="total-cell"
                                        style={{ minWidth: col.minWidth || '120px' }}
                                    >
                                        {col.isSumable ?
                                            (typeof totals[col.key] === 'number' ?
                                                totals[col.key].toFixed(2) : '-') :
                                            '-'
                                        }
                                    </td>
                                ))}
                                {isDetailAddButton && actions.length > 0 && (
                                    <td className="add-button-cell">
                                        {detailAddButton && (
                                            <button
                                                onClick={detailAddButton}
                                                className="add-btn"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
                    </div>

                    <div className="pagination-controls">
                        <button
                            className="pagination-btn first"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            First
                        </button>
                        <button
                            className="pagination-btn prev"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        {paginationItems.map(page => (
                            <button
                                key={page}
                                className={`pagination-btn page ${page === currentPage ? 'active' : ''}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="pagination-btn next"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                        <button
                            className="pagination-btn last"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            Last
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(CustomPaginatedDataTable);