import React, { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    handleChat,
    handleEmojiPicker,
    handleMsgSendToggle,
    setIsChatInitiated,
} from "../../../redux/slice/inboxSlice";
import moment from "moment/moment";
import SocketService from "../../../Service/SocketService";
import useTranslationHook from "../../hooks/useTranslationHook";
import { ACCOUNT } from "../../../utils/constants";

const ChatInput = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    const chatInputRef = useRef(null);

    const [state, setState] = useState({
        text: "",
    });
    const lang = useSelector((state) => state.translation.lang);
    const chat = useSelector((state) => state.inbox.chat);
    const user = useSelector((state) => state.auth.user);
    const selectedUser = useSelector((state) => state.inbox.selectedUser);
    const showPicker = useSelector((state) => state.inbox.showPicker);
    const isChatInitiated = useSelector((state) => state.inbox.isChatInitiated);
    const sendMsgToggle = useSelector((state) => state.inbox.sendMsgToggle);
    const sellerDetail = useSelector((state) => state.inbox.sellerDetail);
    const account = useSelector((state) => state.profile.account);

    const userType = account === ACCOUNT.Buyer ? "buyer" : "agent";

    const firstChatEmitData = {
        user_id: Number(user?.user_id),
        seller_id: sellerDetail?.seller_id,
        property_id: sellerDetail?.property_id,
        domain_id: 3,
        message: state.text,
        user_type: userType,
        chat_doc_ids: "",
    };
    const chatEmitData = {
        user_id: user.user_id,
        master_id: selectedUser?.id,
        property_id: selectedUser?.property_id,
        domain_id: 3,
        message: state.text,
        user_type: userType,
        chat_doc_ids: "",
    };

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            text: "",
        }));
    }, [selectedUser]);

    useEffect(() => {
        return () => {
            SocketService.off("sendMessageToUser");
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                chatInputRef.current &&
                !chatInputRef.current.contains(event.target)
            ) {
                dispatch(handleEmojiPicker(false));
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        setState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const addEmoji = (emoji) => {
        setState((prev) => ({
            ...prev,
            text: prev.text + emoji.native,
        }));
    };

    const handleSendMessages = (firstChat) => {
        SocketService.on("sendMessageToUser", ({ error, data }) => {
            if (error === 0) {
                // dispatch(
                //     handleChat([
                //         ...chat,
                //         {
                //             message: state.text,
                //             added_on: moment().format(),
                //         },
                //     ])
                // );
                if (firstChat) {
                    dispatch(setIsChatInitiated(2));
                }
                dispatch(handleMsgSendToggle(!sendMsgToggle));
                setState((prev) => ({
                    ...prev,
                    text: "",
                }));
            }
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleClick();
        }
    };

    const handleClick = async () => {
        if (
            selectedUser?.domain_id ||
            isChatInitiated === 2 ||
            isChatInitiated === 0
        ) {
            SocketService.send("sendMessageToUser", chatEmitData);
            handleSendMessages();
        } else {
            SocketService.send("sendMessageToUser", firstChatEmitData);
            handleSendMessages("firstChat");
        }
    };

    return (
        <div className="chat-bottom-fixed" ref={chatInputRef}>
            <ul>
                <li>
                    <div className="text-box">
                        <textarea
                            name="text"
                            id=""
                            value={t(state.text)}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={t("Write a message")}
                            rows="1"
                        ></textarea>
                    </div>
                    <div className="text-link">
                        <Link
                            to=""
                            onClick={() => {
                                dispatch(handleEmojiPicker(!showPicker));
                            }}
                            className="smile-icon"
                        >
                            &nbsp;
                        </Link>

                        {showPicker ? (
                            <div className="smily-box absolute bottom-14 left-0 z-10">
                                <Picker
                                    data={data}
                                    onEmojiSelect={addEmoji}
                                    locale={lang}
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </li>
                <li>
                    <button
                        onClick={() => handleClick()}
                        className="send-btn"
                        disabled={!state.text}
                    >
                        &nbsp;
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ChatInput;
