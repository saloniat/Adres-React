import { io } from "socket.io-client";
import store from "../redux/store";
import { setConnected } from "../redux/slice/socketSlice";
import { encryptUserId } from "../utils/encryption";
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "wss://localhost:3001";
const AUTH_TOKEN = process.env.REACT_APP_SOCKET_AUTH_TOKEN || "";
class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.retryCount = 0;
        this.maxRetries = Infinity;
    }

    connect() {
        if (this.socket && this.isConnected) {
            console.warn("⚠️ WebSocket already initialized and connected.");
            return;
        }

        /**
         * // cleanup before reconnecting
         */
        this.socket?.disconnect();
        const state = store.getState();
        const userId = state.auth.user?.user_id;

        this.socket = io(`${SOCKET_URL}`, {
            transports: ["websocket"],
            timeout: 5000,
            reconnection: false, // Manual reconnection
            auth: { token: AUTH_TOKEN },
            query: {
                ...(userId && { user_id: userId }),
            },
        });

        this.socket.on("connect", () => {
            // console.log("✅ WebSocket Connected:", this.socket.id);
            this.isConnected = true;
            this.retryCount = 0;
            store.dispatch(setConnected(true));
        });

        this.socket.on("disconnect", (reason) => {
            console.warn("⚠️ WebSocket Disconnected:", reason);
            this.handleDisconnect();
        });

        this.socket.on("connect_error", (error) => {
            console.error("❌ WebSocket Connection Error:", error.message);
            this.handleDisconnect();
        });
    }

    handleDisconnect() {
        this.isConnected = false;
        this.socket = null;
        store.dispatch(setConnected(false));
        this.reconnect();
    }

    reconnect() {
        if (!this.isConnected && this.retryCount < this.maxRetries) {
            const delay = Math.min(1000 * 2 ** this.retryCount, 10000);
            console.warn(`🔄 Reconnecting in ${delay / 1000}s...`);

            setTimeout(() => {
                // console.log("🔄 Attempting to reconnect...");
                this.retryCount += 1;
                this.connect();
            }, delay);
        }
    }

    send(event, data) {
        if (!this.socket || !this.isConnected) {
            console.warn("⚠️ Cannot send event, WebSocket not connected.");
            return;
        }
        // Encrypt the userId before sending

        if (Array.isArray(data?.data)) {
            const encryptedData = data.data.map((item) => {
                if (item && item.user_id) {
                    return {
                        ...item,
                        user_id: encryptUserId(item.user_id),
                    };
                }
                return item;
            });
            data = { ...data, data: encryptedData };
        } else if (data && typeof data === "object") {
            data = {
                ...data,
                user_id: data.user_id
                    ? encryptUserId(data.user_id)
                    : data.user_id,
            };
        }
        this.socket.emit(event, data);
    }

    off(event) {
        if (!this.socket) return;
        this.socket.off(event);
    }

    on(event, callback, singleton = false) {
        if (!this.socket) return;
        if (singleton) this.socket.off(event); // Prevent duplicate listeners
        this.socket.on(event, callback);
    }

    disconnect() {
        if (!this.socket) return;
        // console.log("❌ Disconnecting WebSocket...");
        this.socket.disconnect();
        this.isConnected = false;
        store.dispatch(setConnected(false));
        this.socket = null;
    }
}

export default new SocketService();
