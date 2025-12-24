/**
 * API Configuration
 * Uses environment variables with fallback to localhost for development
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Helper function to construct full API URLs
 * @param {string} endpoint - The API endpoint (e.g., '/api/auth/login')
 * @returns {string} - The full API URL
 */
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
