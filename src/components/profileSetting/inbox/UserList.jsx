import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    handleChat,
    handleLoadMoreMessages,
    handleSelectedUser,
} from "../../../redux/slice/inboxSlice";
import { Link } from "react-router-dom";
import SocketService from "../../../Service/SocketService";
import { formatChatTime } from "../../../utils";
import useTranslationHook from "../../hooks/useTranslationHook";
import { ACCOUNT } from "../../../utils/constants";

const UserList = () => {
    const { t } = useTranslationHook();
    const dispatch = useDispatch();

    const userList = useSelector((state) => state.inbox.userList);
    const user = useSelector((state) => state.auth.user);
    const selectedUser = useSelector((state) => state.inbox.selectedUser);
    const lang = useSelector((state) => state.translation.lang);
    const sellerDetail = useSelector((state) => state.inbox.sellerDetail);
    const account = useSelector((state) => state.profile.account);
    const { isConnected } = useSelector((state) => state.socket);

    const userType = account === ACCOUNT.Buyer ? "buyer" : "agent";

    useEffect(() => {
        return () => {
            SocketService.off("loadChatRoomConversation");
        };
    }, []);

    const handleClick = useCallback(
        (id) => {
            if (!isConnected) return;

            const syncEmitData = {
                user_id: user.user_id,
                domain_id: 3,
                user_type: userType,
                last_msg_id: "",
                master_id: id,
            };

            const tempSelectedUser = userList.find((ele) => ele.id === id);
            if (!selectedUser || selectedUser.id !== tempSelectedUser?.id) {
                dispatch(handleSelectedUser(tempSelectedUser));
                dispatch(handleLoadMoreMessages(true));
            }

            SocketService.send("loadChatRoomConversation", syncEmitData);
        },
        [user?.user_id, userType, userList, selectedUser, isConnected]
    );

    if (!Array.isArray(userList) || userList.length === 0) return null;

    return (
        <>
            {userList.map((userItem, i) => {
                const isActiveUser =
                    (!sellerDetail?.is_chat_initiated &&
                        !selectedUser &&
                        i === 0) ||
                    (selectedUser && userItem.id === selectedUser.id);

                const imageUrl = userItem?.bucket_name
                    ? `${process.env.REACT_APP_AZURE_BLOB_URL}${userItem.bucket_name}/${userItem.doc_file_name}`
                    : "/img/default.jpg";

                return (
                    <li
                        className={isActiveUser ? "active" : ""}
                        key={userItem.id || i}
                    >
                        <Link to="" onClick={() => handleClick(userItem.id)}>
                            <figure>
                                <img src={imageUrl} alt={t(userItem.name)} />
                                <div
                                    className={`circle ${userItem?.hasOwnProperty("is_logged_in") ? (userItem.is_logged_in ? "active" : "inactive") : ""}`}
                                >
                                    &nbsp;
                                </div>
                            </figure>
                            <figcaption>
                                <h6>{t(userItem.name)}</h6>
                                <div className="timer">
                                    {userItem?.hasOwnProperty(
                                        "child_added_on"
                                    ) &&
                                        formatChatTime(
                                            userItem.child_added_on,
                                            "userList",
                                            lang
                                        )}
                                </div>
                                <div
                                    className={`status ${userItem.isActive ? "active" : "inactive"}`}
                                ></div>
                            </figcaption>
                        </Link>
                    </li>
                );
            })}
        </>
    );
};

export default UserList;
