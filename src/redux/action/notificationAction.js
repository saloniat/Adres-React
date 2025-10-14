import { config, errToast } from "../../utils";
import { isCancel } from "axios";
import {
    setNotificationList,
    setRecentNotification,
    updateNotificationReadStatus,
} from "../slice/notificationSlice";
import { DOMAIN } from "../../utils/constants";
import { sendNotification } from "../../components/notifications/NotificationService";
import { axiosAuth } from "../../utils/axios/axios";
import { toast } from "react-toastify";

export const fetchNotifications = (formData, signal) => {
    return async (dispatch, getState) => {
        const state = getState();
        const user_id = state.auth.user?.user_id;
        const { type, ...rest } = formData || {};
        try {
            const response = await axiosAuth({
                url: getNotificationUrl(type),
                method: "post",
                data: {
                    domain: DOMAIN,
                    ...(user_id && { user_id }),
                    ...(type === 2 && { ...rest }),
                },
                ...config,
                ...(signal ? { signal } : {}),
            });
            const { status, data } = response || {};
            if (status === 200 && data.error === 0) {
                if (type === 1 || type === 2) {
                    const notificationData = {
                        List: data?.data?.data || data?.data || [],
                        ...(type === 2 && { total: data?.data?.total || 0 }),
                    };
                    dispatch(
                        type === 2
                            ? setNotificationList(notificationData)
                            : setRecentNotification(notificationData)
                    );
                } else if (type === 3) {
                    sendNotification();
                    dispatch(updateNotificationReadStatus());
                }
            }
            return response.data;
        } catch (err) {
            if (!isCancel(err)) errToast(err);
        } finally {
            if (type === 1 || type === 2) {
                const action =
                    type === 2 ? setNotificationList : setRecentNotification;
                dispatch(action({ isLoading: false }));
            }
        }
    };
};

const getNotificationUrl = (type) => {
    switch (type) {
        case 2:
            return "/api-notifications/notification-listing/";
        case 3:
            return "/api-notifications/notification-read/";
        default:
            return "/api-notifications/notification-detail/";
    }
};

export const setNotificationSetting = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const user_id = state.auth.user?.user_id;
        const allow_notifications = state.notification.allow_notifications
            ? 1
            : 0;
        try {
            const response = await axiosAuth({
                url: "/api-users/allow-notifications/",
                method: "post",
                data: {
                    ...(user_id && { user_id }),
                    notification_status: allow_notifications,
                },
                ...config,
            });
            const { data } = response || {};
            toast.success(data.msg);
            return response.data;
        } catch (err) {
            errToast(err);
        }
    };
};
