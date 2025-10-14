import store from "../../redux/store";
import SocketService from "../../Service/SocketService";

export const sendNotification = () => {
    const {
        auth: { user },
        socket: { isConnected },
        notification: { allow_notifications },
    } = store.getState();

    if (isConnected && user?.user_id && allow_notifications) {
        SocketService.send("getNotifications", { user_id: user.user_id });
    }
};
