import store from "../../redux/store";
import authSlice from "../../redux/slice/authSlice";
import { axiosUnauth } from "./axios";

export const authActions = authSlice.actions;

// Add this outside the function to track ongoing refresh
let refreshPromise = null;

const getNewAuthToken = async (providedRefreshToken) => {
    // If there's already a refresh in progress, return that promise
    if (refreshPromise) {
        return refreshPromise;
    }

    const dispatch = store.dispatch;
    try {
        // Create new promise and store it
        refreshPromise = (async () => {
            // Clear existing access token
            localStorage.removeItem("access_token");
            sessionStorage.removeItem("access_token");

            // Use provided refresh token or get from storage
            const refreshToken =
                providedRefreshToken ||
                localStorage.getItem("refresh_token") ||
                sessionStorage.getItem("refresh_token");
            const user_id = localStorage.getItem("user_id");

            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const res = await axiosUnauth.post("/api-users/refresh-token/", {
                refresh_token: refreshToken,
                user_id,
            });

            const { access_token, refresh_token } = res.data.data;
            dispatch(
                authActions.loadToken({
                    access_token,
                    refresh_token,
                })
            );

            return {
                access_token,
                refresh_token,
            };
        })();

        const result = await refreshPromise;
        return result;
    } catch (err) {
        console.error("Failed to get new auth token:", err);
        throw err;
    } finally {
        // Clear the promise so future calls can try again
        refreshPromise = null;
    }
};

/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default getNewAuthToken;
