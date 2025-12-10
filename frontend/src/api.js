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
export const deleteOrder = (orderId) => api.delete(`/orders/${orderId}`);
export const createOrder = (order) => api.post('/orders/', order);
export const sendChatMessage = (message) => api.post('/chat/', { message });
export const getOrderStatistics = () => api.get('/orders/statistics');
export const createMenuItem = (item) => api.post('/menu/', item);
export const deleteMenuItem = (itemId) => api.delete(`/menu/${itemId}`);
export const getCategories = () => api.get('/categories');
export const createCategory = (category) => api.post('/categories', category);

// Default export (Axios instance)
export default api;

