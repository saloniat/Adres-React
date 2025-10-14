import { useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import SocketService from "../../Service/SocketService";
import {
    setNotificationList,
    setRecentNotification,
    setTotalCount,
} from "../../redux/slice/notificationSlice";

const useNotifications = () => {
    const dispatch = useDispatch();
    const {
        user,
        isConnected,
        listLoading,
        recentLoading,
        allow_notifications,
    } = useSelector(
        (state) => ({
            user: state.auth?.user,
            isConnected: state.socket.isConnected,
            listLoading: state.notification.notificationList.isLoading,
            recentLoading: state.notification.recentNotification.isLoading,
            allow_notifications: state.notification.allow_notifications,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (isConnected && user?.user_id && allow_notifications) {
            SocketService.send("getNotifications", { user_id: user.user_id }); // emit notification
        }
    }, [isConnected, user?.user_id, allow_notifications]);

    const handleNotifications = useCallback(
        (response) => {
            const notificationCount = response?.data?.notification_cnt ?? 0;
            dispatch(setTotalCount(Number(notificationCount)));
            if (Number(notificationCount)) {
                if (!recentLoading)
                    dispatch(setRecentNotification({ isLoading: true }));
                if (!listLoading)
                    dispatch(setNotificationList({ isLoading: true }));
            }
        },
        [recentLoading, listLoading]
    );

    useEffect(() => {
        if (isConnected && allow_notifications) {
            SocketService.on("syncNotifications", (data) => {
                SocketService.send("getNotifications", {
                    user_id: user?.user_id,
                });
            });
            SocketService.on("getNotifications", handleNotifications); // get response of emit notification
            return () => {
                SocketService.off("syncNotifications");
                SocketService.off("getNotifications", handleNotifications);
            };
        }
    }, [isConnected, handleNotifications, allow_notifications]);

    return null;
};

export default useNotifications;
