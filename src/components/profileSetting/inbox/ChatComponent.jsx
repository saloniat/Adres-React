import React, { useEffect, useRef, useState, useCallback } from "react";
import UserList from "./UserList";
import ChatHeading from "./ChatHeading";
import Chatbox from "./Chatbox";
import ChatInput from "./ChatInput";
import { useDispatch, useSelector } from "react-redux";
import {
    handleChatLoading,
    handleLoadMoreUsers,
    handleSelectedUser,
    handleUserList,
    handleUserListLoading,
    resetChatState,
    setIsChatInitiated,
} from "../../../redux/slice/inboxSlice";
import SocketService from "../../../Service/SocketService";
import useTranslationHook from "../../hooks/useTranslationHook";
import { handleSiteLoader } from "../../../redux/action/authAction";
import { ACCOUNT } from "../../../utils/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import store from "../../../redux/store";

const ChatComponent = () => {
    const chatRef = useRef(null);
    const userRef = useRef(null);
    const chatMiddleRef = useRef(null);

    const { t } = useTranslationHook();
    const dispatch = useDispatch();

    const {
        selectedUser,
        userList,
        isChatInitiated,
        sellerDetail,
        sendMsgToggle,
        chat,
        hasMoreMessages,
        hasMoreUsers,
        loadingChat,
        loadingUserList,
    } = useSelector((state) => state.inbox);
    const user = useSelector((state) => state.auth.user);
    const siteLoader = useSelector((state) => state.auth.siteLoader);
    const account = useSelector((state) => state.profile.account);
    const { isConnected } = useSelector((state) => state.socket);

    const userType = account === ACCOUNT.Buyer ? "buyer" : "agent";

    const [isChatLoaded, setIsChatLoaded] = useState(false);
    const [isUserListLoaded, setIsUserListLoaded] = useState(false);

    const syncEmitData = useCallback(
        () => ({
            user_id: user?.user_id,
            domain_id: 3,
            user_type: userType,
            filter_data: "",
            last_msg_id: "",
        }),
        [user?.user_id, userType]
    );

    const syncEmitLoadMoreUser = useCallback(
        () => ({
            ...syncEmitData(),
            last_msg_id: userList?.[userList.length - 1]?.id || "",
            msg_type: "pre_msg",
        }),
        [userList, syncEmitData]
    );

    const syncEmitLoadMoreChat = useCallback(
        () => ({
            ...syncEmitData(),
            last_msg_id: chat?.[0]?.id || "",
            master_id: selectedUser?.id,
            msg_type: "pre_msg",
        }),
        [chat, selectedUser, syncEmitData]
    );

    useEffect(() => {
        dispatch(handleSiteLoader(!Array.isArray(userList)));
    }, [userList]);

    useEffect(() => {
        if (chat?.length > 0 && !isChatLoaded) setIsChatLoaded(true);
        if (userList?.length > 0 && !isUserListLoaded)
            setIsUserListLoaded(true);
    }, [chat, userList, isChatLoaded, isUserListLoaded]);

    useEffect(() => {
        const adjustHeight = () => {
            const chatSidebarHeight = window.innerHeight - 160;
            const chatMiddleHeight = window.innerHeight - 300;

            if (chatMiddleRef.current) {
                chatMiddleRef.current.style.height = `${chatMiddleHeight}px`;
                chatMiddleRef.current.scrollTop =
                    chatMiddleRef.current.scrollHeight;
            }
            document
                .querySelectorAll(".chat-sidebar, .chat-rightbar")
                .forEach((el) => {
                    el.style.height = `${chatSidebarHeight}px`;
                });
        };

        adjustHeight();
        window.addEventListener("resize", adjustHeight);
        return () => window.removeEventListener("resize", adjustHeight);
    }, [selectedUser, isChatLoaded, isUserListLoaded, sendMsgToggle]);

    useEffect(() => {
        if (!isConnected) return;

        const handleLoadChatRooms = ({
            code,
            error,
            data,
            msg_type,
            msg,
            user_type,
        }) => {
            if (
                error !== 0 ||
                !Array.isArray(data) ||
                user_type?.toLowerCase() !== userType
            )
                return;

            const state = store.getState();
            const selectedUser = state.inbox.selectedUser;
            let sellerDetail = state.inbox.sellerDetail;
            const isChatInitiated = state.inbox.isChatInitiated;

            if (msg_type === "pre_msg") {
                if (data.length === 0) {
                    dispatch(handleLoadMoreUsers(false));
                } else {
                    dispatch((getState) => {
                        const currentUsers = getState().inbox.userList || [];
                        dispatch(handleUserList([...currentUsers, ...data]));
                    });
                }
                dispatch(handleUserListLoading(false));
                return;
            }
            // Handle initial load
            let updatedUserList = data;
            let updatedSelectedUser = selectedUser;
            let sellerAlreadyPresentInList = updatedUserList.find(
                (item) => item.seller_id === sellerDetail.seller_id
            );
            if (sellerAlreadyPresentInList) {
                dispatch(setIsChatInitiated(2));
                sellerDetail = {
                    ...sellerDetail,
                    is_chat_initiated: true,
                };
            }
            if (!sellerDetail?.is_chat_initiated && isChatInitiated === 1) {
                updatedUserList = [
                    ...(!sellerAlreadyPresentInList
                        ? [
                              {
                                  name: sellerDetail.name,
                                  id: sellerDetail.seller_id,
                                  bucket_name:
                                      sellerDetail.profile_image?.bucket_name ||
                                      "",
                                  doc_file_name:
                                      sellerDetail.profile_image
                                          ?.doc_file_name || "",
                                  is_logged_in: false,
                              },
                          ]
                        : []),
                    ...data,
                ];
            } else if (
                (sellerDetail?.is_chat_initiated && !selectedUser) ||
                (!sellerDetail?.is_chat_initiated && isChatInitiated === 2)
            ) {
                updatedSelectedUser = sellerAlreadyPresentInList || null;
                dispatch(setIsChatInitiated(0));
            } else if (!selectedUser && data.length > 0) {
                updatedSelectedUser = data[0];
            }

            if (updatedSelectedUser)
                dispatch(handleSelectedUser(updatedSelectedUser));
            if (updatedUserList.length)
                dispatch(handleUserList(updatedUserList));
            siteLoader && dispatch(handleSiteLoader(false));
        };

        SocketService.on("loadChatRooms", handleLoadChatRooms);

        // Initial fetch
        SocketService.send("loadChatRooms", syncEmitData());

        return () => {
            SocketService.off("loadChatRooms", handleLoadChatRooms);
        };
    }, [isConnected]);

    const loadOlderMessages = () => {
        if (loadingChat || !hasMoreMessages || !chatRef.current) return;

        dispatch(handleChatLoading(true));

        // Save scroll position before loading more
        const scrollTopBefore = chatRef.current.scrollTop;

        // Emit only, listener is handled in useEffect
        const emitData = {
            ...syncEmitLoadMoreChat(),
            msg_type: "pre_msg", // Ensure msg_type for pagination
        };

        SocketService.send("loadChatRoomConversation", emitData);

        // Restore scroll after message append
        setTimeout(() => {
            if (chatRef.current) {
                chatRef.current.scrollTop = scrollTopBefore;
            }
        }, 0);
    };

    const loadOlderUserList = () => {
        if (loadingUserList || !hasMoreUsers || !userRef.current) return;
        dispatch(handleUserListLoading(true));
        const data = syncEmitLoadMoreUser();
        data.msg_type = "pre_msg";
        SocketService.send("loadChatRooms", data);
    };

    useEffect(() => {
        return () => {
            dispatch(handleSiteLoader(false));
            dispatch(resetChatState());
            setIsChatLoaded(false);
            setIsUserListLoaded(false);
        };
    }, []);

    return (
        <section className="chat-body">
            <div className="container py-4">
                <div className="row g-4 align-items-center">
                    <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <h2>{t("Inbox")}</h2>
                        <div>
                            {siteLoader ? (
                                <p className="text-center">
                                    <img
                                        src="/img/no-message-found.png"
                                        alt="no message found"
                                    />
                                </p>
                            ) : sellerDetail || userList?.length ? (
                                <div className="chat-bottom">
                                    <div
                                        className="chat-sidebar"
                                        id="userListSidebar"
                                        ref={userRef}
                                    >
                                        <div className="chat-head">
                                            <h6>{t("Messages")}</h6>
                                        </div>
                                        <InfiniteScroll
                                            dataLength={userList.length}
                                            next={loadOlderUserList}
                                            hasMore={hasMoreUsers}
                                            scrollableTarget="userListSidebar"
                                            loader={
                                                loadingUserList ? (
                                                    <p
                                                        style={{
                                                            textAlign: "center",
                                                            padding: "1rem",
                                                            color: "#888",
                                                        }}
                                                    >
                                                        <b>{t("Loading...")}</b>
                                                    </p>
                                                ) : (
                                                    <></>
                                                )
                                            }
                                            onScroll={() => {
                                                if (loadingUserList) return;
                                            }}
                                        >
                                            <ul>
                                                <UserList />
                                            </ul>
                                        </InfiniteScroll>
                                    </div>
                                    <div className="chat-rightbar">
                                        {selectedUser || sellerDetail ? (
                                            <>
                                                <ChatHeading />
                                                <div
                                                    className="chat-middle"
                                                    ref={(ref) => {
                                                        chatRef.current = ref;
                                                        chatMiddleRef.current =
                                                            ref;
                                                    }}
                                                    id="scrollableDiv"
                                                    style={{
                                                        height: 300,
                                                        overflow: "auto",
                                                        display: "flex",
                                                        flexDirection:
                                                            "column-reverse",
                                                    }}
                                                >
                                                    <InfiniteScroll
                                                        dataLength={chat.length}
                                                        next={loadOlderMessages}
                                                        hasMore={
                                                            hasMoreMessages
                                                        }
                                                        inverse={true}
                                                        scrollableTarget="scrollableDiv"
                                                        style={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column-reverse",
                                                        }}
                                                        loader={
                                                            loadingChat ? (
                                                                <p
                                                                    style={{
                                                                        textAlign:
                                                                            "center",
                                                                        padding:
                                                                            "1rem",
                                                                        color: "#888",
                                                                    }}
                                                                >
                                                                    <b>
                                                                        {t(
                                                                            "Loading..."
                                                                        )}
                                                                    </b>
                                                                </p>
                                                            ) : (
                                                                <></>
                                                            )
                                                        }
                                                        endMessage={
                                                            <p
                                                                style={{
                                                                    textAlign:
                                                                        "center",
                                                                    color: "#888",
                                                                }}
                                                            >
                                                                <b>
                                                                    {t(
                                                                        "No more messages"
                                                                    )}
                                                                </b>
                                                            </p>
                                                        }
                                                        onScroll={() => {
                                                            if (loadingChat)
                                                                return;
                                                        }}
                                                    >
                                                        <ul className="chat-list">
                                                            <Chatbox />
                                                        </ul>
                                                    </InfiniteScroll>
                                                </div>
                                                <ChatInput />
                                            </>
                                        ) : (
                                            <p className="text-center">
                                                <img
                                                    src="/img/no-message-found.png"
                                                    alt="no message found"
                                                />
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center">
                                    <img
                                        src="/img/no-message-found.png"
                                        alt="no message found"
                                    />
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChatComponent;
