import apiClient from '../../config/apiClient';

const transactionService = {
    // Get all transactions with pagination
    getTransactions: async () => {
        try {

            const response = await apiClient.get('/transactions');
            console.log("Transactions API Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching transactions:", error);
            throw error;
        }
    },

    // Get transaction by ID
    getTransactionById: async (id) => {
        try {
            const response = await apiClient.get(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching transaction:", error);
            throw error;
        }
    },

    // Create new transaction
    createTransaction: async (transactionData) => {
        try {
            const response = await apiClient.post('/transactions', transactionData);
            return response.data;
        } catch (error) {
            console.error("Error creating transaction:", error);
            throw error;
        }
    },

    // Update transaction
    updateTransaction: async (id, transactionData) => {
        try {
            const response = await apiClient.put(`/transactions/${id}`, transactionData);
            return response.data;
        } catch (error) {
            console.error("Error updating transaction:", error);
            throw error;
        }
    },

    // Delete transaction
    deleteTransaction: async (id) => {
        try {
            const response = await apiClient.delete(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting transaction:", error);
            throw error;
        }
    },

    // Get transaction statistics
    getTransactionStats: async (period = 'monthly') => {
        try {
            const response = await apiClient.get(`/transactions/stats?period=${period}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching transaction stats:", error);
            throw error;
        }
    },

    // Export transactions
    exportTransactions: async (filters = {}) => {
        try {
            const response = await apiClient.get('/transactions/export', {
                params: filters,
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error("Error exporting transactions:", error);
            throw error;
        }
    },

    // Get categories
    getCategories: async () => {
        try {
            const response = await apiClient.get('/categories');
            console.log("Categories API Response:", response.data.categories);
            return response.data.categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
};

export default transactionService;