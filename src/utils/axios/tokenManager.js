import getNewAuthToken from "./getAuthToken";
import setAuthToken from "./setAuthToken";
import logTokenState from "./logTokenState";
import { axiosAuth } from "./axios";

class TokenManager {
    static instance = null;
    tokenData = null;
    refreshPromise = null;

    constructor() {
        if (!TokenManager.instance) {
            TokenManager.instance = this;
            this.loadTokenFromStorage();
        }
        return TokenManager.instance;
    }

    static getInstance() {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }

    loadTokenFromStorage() {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        if (accessToken && refreshToken) {
            this.tokenData = {
                access_token: accessToken,
                refresh_token: refreshToken,
                expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
            };
            logTokenState(
                "Loaded token from storage",
                this.tokenData.access_token
            );
        }
    }

    saveTokenToStorage() {
        if (this.tokenData) {
            localStorage.setItem("access_token", this.tokenData.access_token);
            localStorage.setItem("refresh_token", this.tokenData.refresh_token);
        } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
    }

    async getValidToken() {
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        const isExpiredOrExpiringSoon =
            !this.tokenData || this.tokenData.expiresAt <= Date.now() + 30000; // 30-second buffer

        if (isExpiredOrExpiringSoon && this.tokenData?.refresh_token) {
            this.refreshPromise = this.refreshToken();
            try {
                const newToken = await this.refreshPromise;
                return newToken.accessToken;
            } finally {
                this.refreshPromise = null;
            }
        }

        if (this.tokenData?.access_token) {
            return this.tokenData.access_token;
        }
        // set the static token when token is not present
        setAuthToken(process.env.REACT_APP_STATIC_TOKEN);
        throw new Error("No valid token available");
    }

    // getRefreshToken() {
    //     return this.tokenData?.refresh_token || '';
    // }

    setTokens(tokenData) {
        if (!tokenData.access_token || !tokenData.refresh_token) {
            throw new Error("Invalid token data provided");
        }

        this.tokenData = {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expiresAt: tokenData.expiresAt || Date.now() + 10 * 60 * 1000, // 10 minutes expiry
        };

        this.saveTokenToStorage();
        setAuthToken(tokenData.access_token, true);
        logTokenState("New tokens set", tokenData.access_token);
    }

    async refreshToken() {
        try {
            if (!this.tokenData?.refresh_token) {
                logTokenState("Refresh failed - No refresh token", undefined);
                throw new Error("No refresh token available");
            }

            setAuthToken(process.env.REACT_APP_STATIC_TOKEN);

            const newToken = await getNewAuthToken(
                this.tokenData.refresh_token
            );
            this.setTokens({
                access_token: newToken.access_token,
                refresh_token: newToken.refresh_token,
                expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
            });

            return newToken;
        } catch (error) {
            this.clearTokens();
            throw error;
        }
    }

    getTokenData() {
        return this.tokenData ? { ...this.tokenData } : null;
    }

    clearTokens(silent = false) {
        this.tokenData = null;
        this.saveTokenToStorage();
        delete axiosAuth.defaults.headers.common["Authorization"];
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        setAuthToken(process.env.REACT_APP_STATIC_TOKEN);

        if (!silent) {
            logTokenState("Tokens cleared", "");
            window.location.href = "/";
        }
    }
}

export default TokenManager;
