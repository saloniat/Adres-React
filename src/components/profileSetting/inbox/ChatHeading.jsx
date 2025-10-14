import React from "react";
import { useSelector } from "react-redux";
import useTranslationHook from "../../hooks/useTranslationHook";

const ChatHeading = () => {
    const { t } = useTranslationHook();
    const sellerDetail = useSelector((state) => state.inbox.sellerDetail);
    const selectedUser = useSelector((state) => state.inbox.selectedUser);

    return (
        <div className="chat-top-active">
            <figure>
                <img
                    src={
                        sellerDetail && !selectedUser
                            ? sellerDetail?.profile_image?.bucket_name
                                ? `${process.env.REACT_APP_AZURE_BLOB_URL}${sellerDetail?.profile_image?.bucket_name}/${sellerDetail?.profile_image?.doc_file_name}`
                                : "/img/default.jpg"
                            : selectedUser?.bucket_name
                              ? `${process.env.REACT_APP_AZURE_BLOB_URL}${selectedUser?.bucket_name}/${selectedUser?.doc_file_name}`
                              : "/img/default.jpg"
                    }
                    alt=""
                />
                <div
                    className={`circle ${selectedUser?.hasOwnProperty("is_logged_in") ? (selectedUser.is_logged_in ? "active" : "inactive") : "inactive"}`}
                >
                    &nbsp;
                </div>
            </figure>
            <figcaption>
                <h6>
                    {sellerDetail && !selectedUser
                        ? t(sellerDetail.name)
                        : t(selectedUser.name)}
                    <span>
                        {selectedUser?.hasOwnProperty("is_logged_in")
                            ? selectedUser.is_logged_in
                                ? t("Online")
                                : "Offline"
                            : ""}
                    </span>
                </h6>
            </figcaption>
        </div>
    );
};

export default ChatHeading;
