import axios from 'axios';

// Base URL of your backend API
const API_URL = 'http://localhost:8000';

// Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Named exports for API calls
export const getMenu = () => api.get('/menu/');
export const getAnalytics = () => api.get('/analytics/');
export const getOrders = () => api.get('/orders/'); // Added getOrders
export const updateOrderStatus = (orderId, status) =>
    api.put(`/orders/${orderId}/status`, { order_status: status });
export const createOrder = (order) => api.post('/orders/', order);
export const sendChatMessage = (message) => api.post('/chat/', { message });

// Default export (Axios instance)
export default api;

