import axiosOriginal from "axios";
import { logTokenState } from "./logTokenState";
import TokenManager from "./tokenManager";

export const tokenManager = TokenManager.getInstance();

// Update your tokenIsValid function to use the token manager:
export const tokenIsValid = async (token) => {
    try {
        return await tokenManager.getValidToken();
    } catch (error) {
        logTokenState("Failed to get valid token", token, error);
        throw error;
    }
};

const api = axiosOriginal.create({
    baseURL: process.env.REACT_APP_WEB_API,
});

const axiosUnauth = axiosOriginal.create({
    baseURL: process.env.REACT_APP_WEB_API,
});

// Add request interceptor to automatically add valid token
api.interceptors.request.use(async (config) => {
    try {
        const token = await tokenManager.getValidToken();
        // const refreshToken = tokenManager.getRefreshToken();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    } catch (error) {
        // Handle token error (e.g., redirect to login)
        throw error;
    }
});

api.interceptors.response.use(
    (response) => {
        //This is to fix AD-251(Prevent multiple multiple Inactive toast msg.)
        if (response?.data?.msg === "You are not active user.") {
            tokenManager.clearTokens();
            sessionStorage.setItem("inactiveUser","You are not active user.")
            return Promise.reject("You are not active user.");
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // If we get a 401 and haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const tokenManager = TokenManager.getInstance();
                // Force a token refresh
                await tokenManager.refreshToken();

                // Update the failed request with new token and retry
                const newToken = await tokenManager.getValidToken();
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to home
                TokenManager.getInstance().clearTokens();
                // No need to explicitly redirect here since clearTokens will handle it
                throw refreshError;
            }
        }

        throw error;
    }
);

// Export api as default and as 'axios' for backward compatibility
export { api as axiosAuth, axiosUnauth };
export default api;
