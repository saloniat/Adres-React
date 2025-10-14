import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActiveCard from "../common/ActiveCard";
import { handleDiscoverAuctions } from "../../../redux/action/buyerAction";
import {
    handleHomeBidLoading,
    setHomeBidData,
} from "../../../redux/slice/bidSlice";
import Shimmer from "../../common/shimmer/Shimmer";
import { Link } from "react-router-dom";
import useSocketSync from "../../hooks/useSocketSync";
import useTranslationHook from "../../hooks/useTranslationHook";

const Bids = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const homeBidData = useSelector((state) => state.bid.homeBidData);
    const homeBidLoading = useSelector((state) => state.bid.homeBidLoading);
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const { t } = useTranslationHook();

    useEffect(
        () => {
            const abortController = new AbortController();
            const signal = abortController.signal;

            if (isAuthenticated) {
                dispatch(handleHomeBidLoading(true));
                (async () => {
                    const response = await dispatch(
                        handleDiscoverAuctions(
                            {
                                ...(user?.site_id && {
                                    site_id: Number(user.site_id),
                                }),
                                page_size: 2,
                                short_by: "",
                                sort_order: "asc",
                                is_active_bid: 1,
                                ...(user?.user_id && {
                                    user_id: Number(user.user_id),
                                }),
                            },
                            signal
                        )
                    );
                    const { data } = response || {};
                    dispatch(
                        setHomeBidData({
                            data: data?.data ? data.data : [],
                            total: data?.total ? data.total : 0,
                        })
                    );
                })();
            }

            return () => {
                abortController.abort();
            };
        },
        //eslint-disable-next-line
        []
    );

    const syncData = useSocketSync(homeBidData, user?.user_id, "bidsSync");

    if (!isAuthenticated || !homeBidData?.length) return <></>;
    return (
        <>
            <section className="bids-wrap">
                <div className="container pb-5">
                    <div className="row">
                        <div
                            className={`col-lg-12 ${
                                Array.isArray(homeBidData) &&
                                homeBidData?.length > 0
                                    ? "wow fadeInUp"
                                    : ""
                            } `}
                            {...(Array.isArray(homeBidData) &&
                            homeBidData.length > 0
                                ? { "data-wow-delay": "0.5s" }
                                : {})}
                        >
                            <div className="main-heading">
                                <h3>
                                    <span>{t("Your Active Bids")}</span>
                                </h3>
                                {Array.isArray(homeBidData) &&
                                    homeBidData?.length > 0 && (
                                        <Link to="/bids" className="see-link">
                                            {t("See all")}{" "}
                                            <img
                                                src="img/arrow-r.svg"
                                                alt="arrow right"
                                            />
                                        </Link>
                                    )}
                            </div>
                            {homeBidLoading ? (
                                [1, 2].map((element, index) => (
                                    <Shimmer
                                        key={index}
                                        type="rectangle"
                                        width="48%"
                                        height="50vh"
                                        borderRadius="10%"
                                    />
                                ))
                            ) : Array.isArray(homeBidData) &&
                              homeBidData?.length > 0 ? (
                                <ul className="bids-list">
                                    {homeBidData
                                        ?.slice(0, 2)
                                        .map((ele, ind) => (
                                            <ActiveCard
                                                ele={ele}
                                                key={ind}
                                                syncData={
                                                    syncData?.filter(
                                                        ({ property_id }) =>
                                                            property_id ===
                                                            ele?.id
                                                    )?.[0]
                                                }
                                            />
                                        ))}
                                </ul>
                            ) : (
                                <li className="full text-center">
                                    <img
                                        src="/img/no-property-found.png"
                                        alt={t("No active bids found")}
                                    />

                                    <h6>{t("No active bids found")}</h6>
                                </li>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Bids;
