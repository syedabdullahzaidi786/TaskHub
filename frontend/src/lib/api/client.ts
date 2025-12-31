/**
 * API client configuration
 * Axios instance configured for backend communication
 */
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Configured Axios instance
 * - baseURL: Backend API URL
 * - withCredentials: Enable cookies for session management
 * - Error interceptor: Handle common HTTP errors
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message from response
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Attach formatted error message
    error.userMessage = message;

    return Promise.reject(error);
  }
);
