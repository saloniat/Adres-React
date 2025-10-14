import { createSlice } from "@reduxjs/toolkit";
import { groupNotificationByDate } from "../../utils";

const initialState = {
    totalCount: 0,
    allow_notifications: true,
    recentNotification: {
        List: {},
        isLoading: true,
    },
    notificationList: {
        List: {},
        total: 0,
        pageSize: 10,
        currentPage: 1,
        isLoading: true,
    },
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setPage: (state, { payload }) => {
            return {
                ...state,
                notificationList: {
                    ...state.notificationList,
                    currentPage: payload,
                },
            };
        },
        setTotalCount: (state, { payload }) => {
            return {
                ...state,
                totalCount: payload,
            };
        },
        toggleNotification: (state, { payload }) => {
            state.allow_notifications = payload;
        },
        setRecentNotification: (state, { payload }) => {
            const { List, isLoading } = payload;
            return {
                ...state,
                recentNotification: {
                    ...state.recentNotification,
                    ...(List && {
                        List: groupNotificationByDate(List),
                    }),
                    ...("isLoading" in payload && { isLoading }),
                },
            };
        },
        setNotificationList: (state, { payload }) => {
            const { List, total, isLoading } = payload;
            return {
                ...state,
                notificationList: {
                    ...state.notificationList,
                    ...("total" in payload && { total }),
                    ...(List && {
                        List: groupNotificationByDate(List),
                    }),
                    ...("isLoading" in payload && { isLoading }),
                },
            };
        },
        updateNotificationReadStatus: (state) => {
            Object.keys(state.recentNotification.List || {})?.forEach((day) => {
                state.recentNotification.List[day] =
                    state.recentNotification.List[day].map((notification) => ({
                        ...notification,
                        is_read: true,
                    }));
            });
        },
    },
});

export const {
    setPage,
    setTotalCount,
    toggleNotification,
    setRecentNotification,
    setNotificationList,
    updateNotificationReadStatus,
} = notificationSlice.actions;

export default notificationSlice;
