import axios from 'axios';
import config from './config';

// Function to get token from sessionStorage
const getToken = () => {
    const userInfo = sessionStorage.getItem('userInfo');
    if (!userInfo) return null;

    try {
        const parsedUserInfo = JSON.parse(userInfo);
        return parsedUserInfo.token || null;
    } catch (error) {
        console.error("Error parsing userInfo:", error);
        return null;
    }
};

// Create Axios instance
const apiClient = axios.create({
    baseURL: config.BASE_URL, // e.g., http://localhost:3000/api
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// 🔹 Request interceptor: attach token
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔹 Response interceptor: handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = "Network error";

        if (error.response) {
            const { status, data } = error.response;
            console.error("API Error Response:", status, data);

            errorMessage = data?.message || data?.error || "Something went wrong";

            // Handle 401 Unauthorized globally
            if (status === 401) {
                sessionStorage.removeItem('userInfo');
                window.location.href = '/login'; // redirect to login
            }
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Axios request setup error:", error.message);
            errorMessage = error.message;
        }

        return Promise.reject(new Error(errorMessage));
    }
);

export default apiClient;
