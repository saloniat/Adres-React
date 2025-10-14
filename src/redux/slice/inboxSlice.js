import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userList: "",
    chat: [],
    selectedUser: "",
    isChatInitiated: 0,
    sellerDetail: "",
    showPicker: false,
    sendMsgToggle: false,
    hasMoreMessages: true,
    hasMoreUsers: true,
    loadingChat: false,
    loadingUserList: false,
};

export const inboxSlice = createSlice({
    name: "inbox",
    initialState,
    reducers: {
        handleUserList: (state, action) => {
            return {
                ...state,
                userList: action.payload,
            };
        },
        handleChat: (state, action) => {
            return {
                ...state,
                chat: action.payload,
            };
        },
        handleSelectedUser: (state, action) => {
            return {
                ...state,
                selectedUser: action.payload,
            };
        },
        setIsChatInitiated: (state, action) => {
            return {
                ...state,
                isChatInitiated: action.payload,
            };
        },
        setSellerDetail: (state, action) => {
            return {
                ...state,
                sellerDetail: action.payload,
            };
        },
        handleEmojiPicker: (state, action) => {
            return {
                ...state,
                showPicker: action.payload,
            };
        },
        handleMsgSendToggle: (state, action) => {
            return {
                ...state,
                sendMsgToggle: action.payload,
            };
        },
        handleLoadMoreMessages: (state, action) => {
            return {
                ...state,
                hasMoreMessages: action.payload,
            };
        },
        handleLoadMoreUsers: (state, action) => {
            return {
                ...state,
                hasMoreUsers: action.payload,
            };
        },
        resetChatState: (state) => {
            return {
                ...state,
                selectedUser: initialState.selectedUser,
                sellerDetail: initialState.sellerDetail,
                isChatInitiated: initialState.isChatInitiated,
                hasMoreMessages: initialState.hasMoreMessages,
                hasMoreUsers: initialState.hasMoreUsers,
                userList: initialState.userList,
            };
        },
        handleChatLoading: (state, action) => {
            return {
                ...state,
                loadingChat: action.payload,
            };
        },
        handleUserListLoading: (state, action) => {
            return {
                ...state,
                loadingUserList: action.payload,
            };
        },
    },
});

export const {
    handleUserList,
    handleChat,
    handleSelectedUser,
    setIsChatInitiated,
    setSellerDetail,
    handleEmojiPicker,
    handleMsgSendToggle,
    handleLoadMoreMessages,
    handleLoadMoreUsers,
    resetChatState,
    handleChatLoading,
    handleUserListLoading,
} = inboxSlice.actions;
export default inboxSlice;
