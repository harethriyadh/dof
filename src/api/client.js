// DOF-B API Client for Leave Management System
// Base API: import.meta.env.VITE_API_BASE or default to http://localhost:3001/api/v1

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api/v1';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('authToken');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth methods
    async login(username, password) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    async register(userData) {
        return this.request('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Utility methods
    saveAuth(token, user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(user));
    }

    clearAuth() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    }

    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('authUser');
        return userStr ? JSON.parse(userStr) : null;
    }
}

// Create and export singleton instance
const apiClient = new ApiClient();

// Export both the instance and individual functions for backward compatibility
export default apiClient;

// Legacy exports for existing code
export const apiRequest = (path, options = {}) => apiClient.request(path, options);
export const saveAuth = (token, user) => apiClient.saveAuth(token, user);
export const clearAuth = () => apiClient.clearAuth();
export const isAuthenticated = () => apiClient.isAuthenticated();
