import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { handleToggleModal } from "../../redux/slice/modalSlice";
import { useNavigate } from "react-router-dom";
import { fetchNotifications } from "../../redux/action/notificationAction";
import NotificationItem from "./NotificationItem";
import Shimmer from "../common/shimmer/Shimmer";
import useTranslationHook from "../hooks/useTranslationHook";

const Notification = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslationHook();

    const user_id = useSelector(
        (state) => state.auth.user?.user_id,
        shallowEqual
    );
    const commonModal = useSelector((state) => state.modal.commonModal);
    let List = useSelector(
        (state) => state.notification.recentNotification.List,
        shallowEqual
    );
    const isLoading = useSelector(
        (state) => state.notification.recentNotification.isLoading,
        shallowEqual
    );

    useEffect(() => {
        (async () => {
            if (!isLoading || !user_id) return;
            const response = await dispatch(fetchNotifications({ type: 1 }));
            if (response?.error === 0)
                dispatch(fetchNotifications({ type: 3 }));
        })();
    }, [user_id, isLoading]);

    if (!commonModal) return null;

    const modalContent = (
        <div
            className="modal fade show d-block"
            id="notificationModal"
            tabIndex="-1"
            // onClick={() => dispatch(handleToggleModal({ commonModal: false }))}
        >
            <div
                className={`modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg`}
                // onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="modal-title">{t("Notifications")}</h6>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() =>
                                dispatch(
                                    handleToggleModal({ commonModal: false })
                                )
                            }
                        ></button>
                    </div>
                    <div className="modal-body mb-0">
                        {isLoading ? (
                            [1, 2, 3, 4].map((_, index) => (
                                <Shimmer
                                    key={index}
                                    type="rectangle"
                                    width="100%"
                                    height="80px"
                                    marginBottom="0px"
                                />
                            ))
                        ) : (
                            <NotificationItem notiList={List} />
                        )}
                    </div>
                    {Boolean(Object.keys(List || {}).length) && (
                        <div className="clearfix">
                            <button
                                className="btn btn-white"
                                onClick={() => {
                                    dispatch(
                                        handleToggleModal({
                                            commonModal: false,
                                        })
                                    );
                                    navigate("/notification-list");
                                }}
                            >
                                {t("View All Notifications")}{" "}
                                <img
                                    src="img/arrow-right.svg"
                                    alt=""
                                    className="ml4"
                                />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default React.memo(Notification);
