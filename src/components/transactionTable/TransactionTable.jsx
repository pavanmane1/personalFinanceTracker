import React, { useMemo } from 'react';
import CustomPaginatedDataTable from '../datatable/CustomPaginatedDataTable';
import { FaEye, FaEdit, FaTrash, FaDownload, FaReceipt } from 'react-icons/fa';

const TransactionTable = ({
    transactions,
    loading,
    onEdit,
    onDelete,
    searchFields = ['description', 'category'],
    itemsPerPage = 10
}) => {
    const columns = useMemo(() => [
        {
            header: 'Date',
            key: 'date',
            render: value => new Date(value).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        },
        { header: 'Description', key: 'description' },
        {
            header: 'Category',
            key: 'category',
            render: value => (
                <span className={`category-badge category-${value?.toLowerCase().replace(/\s/g, '-') || 'unknown'}`}>
                    {value || 'Unknown'}
                </span>
            )
        },
        {
            header: 'Type',
            key: 'type',
            render: value => (
                <span className={`type-badge type-${value}`}>
                    {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'}
                </span>
            )
        },
        {
            header: 'Amount',
            key: 'amount',
            render: (value, row) => (
                <span className={row.type === 'income' ? 'amount-income' : 'amount-expense'}>
                    {row.type === 'income' ? '+' : '-'}₹{Math.abs(value).toFixed(2)}
                </span>
            )
        },

    ], []);

    const actions = useMemo(() => [

        {
            icon: <FaEdit />,
            title: 'Edit',
            onClick: onEdit,
            className: 'text-warning'
        },
        {
            icon: <FaTrash />,
            title: 'Delete',
            onClick: onDelete,
            className: 'text-danger'
        },

    ], [onEdit, onDelete]);

    const emptyState = (
        <div className="empty-state">
            <FaReceipt className="empty-state-icon" />
            <h4>No transactions found</h4>
            <p>Try changing filters or add a new transaction.</p>
        </div>
    );

    return (
        <CustomPaginatedDataTable
            columns={columns}
            data={transactions}
            actions={actions}
            itemsPerPage={itemsPerPage}
            searchFields={searchFields}
            loading={loading}
            emptyState={emptyState}
        />
    );
};

export default TransactionTable;