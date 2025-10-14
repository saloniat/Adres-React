import socketService from "../../Service/SocketService";

export const initSocket = () => (dispatch, getState) => {
    if (!getState().socket.isConnected) {
        // console.log("🔄 Initializing WebSocket...");
        socketService.connect(dispatch);
    }
};

export const unsubscribeFromEvent = (event) => () => {
    socketService.off(event);
};

export const sendSocketEvent = (event, data) => () => {
    socketService.send(event, data);
};

export const disconnectSocket = () => () => {
    socketService.disconnect();
};
