import io from "socket.io-client";

let socket = null;

const socketMiddleware = (store) => (next) => (action) => {
    if (action?.type === "socket/init") {
        if (socket) {
            socket.disconnect(); // Ensure no duplicate connections
        }

        const { url } = action.payload;
        const configs = {
            transports: ["websocket"],
            timeout: 5000,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
        };

        socket = io(url, configs);

        socket.on("connect", () => {
            // console.log("✅ WebSocket Connected");
            store.dispatch({ type: "socket/connected" });
        });

        socket.on("disconnect", () => {
            // console.warn("⚠️ WebSocket Disconnected");
            store.dispatch({ type: "socket/disconnected" });
        });

        socket.on("error", (error) => {
            console.error("❌ WebSocket Error:", error);
        });

        socket.on("message", (message) => {
            store.dispatch({ type: "socket/message", payload: message });
        });
    }

    return next(action);
};

export default socketMiddleware;
