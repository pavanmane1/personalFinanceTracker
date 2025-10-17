import apiClient from '../../config/apiClient';

const authService = {
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        const { token, user } = response.data;

        if (!token || !user) {
            throw new Error('Invalid login response');
        }

        return { token, user };
    },

    register: async (userData) => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            const data = response.data;

            if (!data || !data.user) {
                throw new Error(data?.message || 'Registration failed');
            }

            return data; // Expecting { user, message } or similar
        } catch (error) {
            // Handle backend or network errors
            const message =
                error.response?.data?.message ||
                error.message ||
                'Registration failed. Please try again.';
            throw new Error(message);
        }
    },

    logout: () => {
        sessionStorage.removeItem('userInfo');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const userInfo = sessionStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).user : null;
    },

    getToken: () => {
        const userInfo = sessionStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).token : null;
    },

    isAuthenticated: () => {
        return !!sessionStorage.getItem('userInfo');
    }
};

export default authService;
