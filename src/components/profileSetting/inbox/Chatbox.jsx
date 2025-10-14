import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    handleChat,
    handleChatLoading,
    handleLoadMoreMessages,
} from "../../../redux/slice/inboxSlice";
import SocketService from "../../../Service/SocketService";
import { formatChatTime } from "../../../utils";
import useTranslationHook from "../../hooks/useTranslationHook";
import { ACCOUNT } from "../../../utils/constants";
import store from "../../../redux/store";

const Chatbox = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    const chat = useSelector((state) => state.inbox.chat);
    const sellerDetail = useSelector((state) => state.inbox.sellerDetail);
    const user = useSelector((state) => state.auth.user);
    const lang = useSelector((state) => state.translation.lang);
    const account = useSelector((state) => state.profile.account);
    const selectedUser = useSelector((state) => state.inbox.selectedUser);
    const { isConnected } = useSelector((state) => state.socket);

    const userType = account === ACCOUNT.Buyer ? "buyer" : "agent";

    const syncEmitData = useCallback(
        () => ({
            user_id: user.user_id,
            domain_id: 3,
            user_type: userType,
            last_msg_id: "",
            master_id: selectedUser?.id,
        }),
        [user?.user_id, userType, selectedUser?.id]
    );

    // useEffect(() => {
    //     if (!isConnected || !selectedUser) return;

    //     const handleChatUpdate = ({ code, error, data }) => {
    //         if (error) return;

    //         const chatData =
    //             Array.isArray(data) && data.length > 0
    //                 ? [...data].reverse()
    //                 : [];
    //         chatData.length && dispatch(handleChat(chatData));
    //     };

    //     SocketService.send("loadChatRoomConversation", syncEmitData());
    //     SocketService.on("loadChatRoomConversation", handleChatUpdate);

    //     return () => {
    //         SocketService.off("loadChatRoomConversation", handleChatUpdate);
    //     };
    // }, [isConnected, selectedUser?.id, syncEmitData]);

    useEffect(() => {
        if (!isConnected || (!selectedUser && !sellerDetail)) return;

        const handleChatUpdate = ({
            code,
            error,
            data,
            msg_type,
            user_type,
        }) => {
            if (
                error ||
                user_type?.toLowerCase() !== userType ||
                // checking the master id
                (selectedUser &&
                    Array.isArray(data) &&
                    data.length &&
                    selectedUser?.id !== data[0].master_id)
            )
                return;
            const newMessages = Array.isArray(data) ? [...data].reverse() : [];

            if (msg_type === "pre_msg") {
                // For older (pagination) messages
                if (newMessages.length === 0) {
                    dispatch(handleLoadMoreMessages(false));
                } else {
                    const currentChat = store.getState().inbox.chat || [];
                    dispatch(handleChat([...newMessages, ...currentChat]));
                }
            } else {
                // For initial messages

                dispatch(handleChat(newMessages));
            }
            dispatch(handleChatLoading(false));
        };

        selectedUser &&
            SocketService.send("loadChatRoomConversation", syncEmitData());

        SocketService.on("loadChatRoomConversation", handleChatUpdate);

        return () => {
            SocketService.off("loadChatRoomConversation", handleChatUpdate);
        };
    }, [isConnected]);

    if (!Array.isArray(chat) || chat.length === 0) return null;

    return (
        <>
            {chat.map((content, i) => (
                <li key={i}>
                    <div
                        className={`chat-align ${content?.sender_id === Number(user?.user_id) ? "rgt-chat" : "lft-chat"}`}
                    >
                        <figcaption>
                            <p>{t(content.message)}</p>
                            <div className="chat-time">
                                {formatChatTime(content.added_on, "", lang)}
                            </div>
                        </figcaption>
                    </div>
                </li>
            ))}
        </>
    );
};

export default Chatbox;
