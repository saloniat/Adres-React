import React, { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getTotalPages } from "../../helpers";
import { fetchNotifications } from "../../redux/action/notificationAction";
import NotificationItem from "./NotificationItem";
import Shimmer from "../common/shimmer/Shimmer";
import {
    setNotificationList,
    setPage,
} from "../../redux/slice/notificationSlice";
import { Pagination } from "../common/Pagination";
import useTranslationHook from "../hooks/useTranslationHook";

const NotificationList = () => {
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    let List = useSelector(
        (state) => state.notification.notificationList.List,
        shallowEqual
    );
    const isLoading = useSelector(
        (state) => state.notification.notificationList.isLoading,
        shallowEqual
    );
    const total = useSelector(
        (state) => state.notification.notificationList.total,
        shallowEqual
    );
    const pageSize = useSelector(
        (state) => state.notification.notificationList.pageSize,
        shallowEqual
    );
    const currentPage = useSelector(
        (state) => state.notification.notificationList.currentPage,
        shallowEqual
    );

    const totalPages = useMemo(() => {
        return getTotalPages(total, pageSize);
    }, [total, pageSize]);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        if (!isLoading) return;
        dispatch(
            fetchNotifications(
                {
                    type: 2,
                    page: currentPage,
                    page_size: pageSize,
                },
                signal
            )
        );
        return () => {
            abortController.abort();
        };
    }, [isLoading, currentPage]);

    return (
        <section className="notification-wrap">
            <div className="container py-5">
                <div className="row">
                    <div
                        className="col-lg-10 col-md-12 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <h2>{t("Notifications")}</h2>
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
                        {/* <div className="title">Yesterday</div>
                        <ul className="noti-list">
                            <li>
                                <div className="icon green-bg">
                                    <img src="img/check-icon.svg" alt />
                                </div>
                                <div className="text">
                                    <h6>
                                        Your property{" "}
                                        <strong>Property Name</strong> has been{" "}
                                        <strong>approved</strong> for auction!
                                    </h6>
                                    <button className="btn btn-primary btn-xs">
                                        Put it on Auction
                                    </button>
                                </div>
                                <div className="duration">1d</div>
                            </li>
                            <li>
                                <div className="icon orange-bg">
                                    <img
                                        src="img/reload-icon.svg"
                                        alt="Reload Icon"
                                    />
                                </div>
                                <div className="text">
                                    <h6>
                                        Your property{" "}
                                        <strong>Property Name</strong> has been{" "}
                                        <strong>Returned</strong>.
                                    </h6>
                                    <button className="btn btn-sky btn-xs">
                                        Resubmit Property
                                    </button>
                                </div>
                                <div className="duration">1d</div>
                            </li>
                            <li>
                                <div className="icon pink-bg">
                                    <img
                                        src="img/bid-icon.svg"
                                        alt="Bid Icon"
                                    />
                                </div>
                                <div className="text">
                                    <h6>
                                        Your <strong>Property Name</strong> has
                                        ended. Final bid: [Amount]. We’ll guide
                                        you through the next steps.
                                    </h6>
                                    <button className="btn btn-sky btn-xs">
                                        View Details
                                    </button>
                                </div>
                                <div className="duration">1d</div>
                            </li>
                        </ul>
                        <div className="title">Last Week</div>
                        <ul className="noti-list">
                            <li>
                                <div className="icon blue-bg">
                                    <img src="img/info-icon.svg" alt />
                                </div>
                                <div className="text">
                                    <h6>
                                        Your property{" "}
                                        <strong>Property Name</strong> has been{" "}
                                        <strong>approved</strong> for auction!
                                    </h6>
                                    <button className="btn btn-sky btn-xs">
                                        View Details
                                    </button>
                                </div>
                                <div className="duration">1d</div>
                            </li>
                            <li>
                                <div className="icon blue-bg">
                                    <img
                                        src="img/info-icon.svg"
                                        alt="Reload Icon"
                                    />
                                </div>
                                <div className="text">
                                    <h6>
                                        Your property{" "}
                                        <strong>Property Name</strong> has been{" "}
                                        <strong>Returned</strong>.
                                    </h6>
                                    <button className="btn btn-sky btn-xs">
                                        View Details
                                    </button>
                                </div>
                                <div className="duration">1d</div>
                            </li>
                            <li>
                                <div className="icon blue-bg">
                                    <img
                                        src="img/info-icon.svg"
                                        alt="Bid Icon"
                                    />
                                </div>
                                <div className="text">
                                    <h6>
                                        Your <strong>Property Name</strong> has
                                        ended. Final bid: [Amount]. We’ll guide
                                        you through the next steps.
                                    </h6>
                                    <button className="btn btn-sky btn-xs">
                                        View Details
                                    </button>
                                </div>
                                <div className="duration">1d</div>
                            </li>
                        </ul> */}
                        {!isLoading && (
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={(page) => {
                                    dispatch(
                                        setNotificationList({ isLoading: true })
                                    );
                                    dispatch(setPage(page));
                                }}
                            />
                        )}

                        {/* <div className="text-center">
                            <button
                                className="btn btn-primary"
                                // onClick={() => {
                                //     dispatch(
                                //         setNotificationList({ isLoading: true })
                                //     );
                                //     dispatch(setPage(currentPage + 1));
                                // }}
                            >
                                Load More
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotificationList;
