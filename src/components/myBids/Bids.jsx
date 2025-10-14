import React, { useEffect, useMemo } from "react";
import Tabs from "../common/Tabs";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleDiscoverAuctions } from "../../redux/action/buyerAction";
import {
    setActiveTab,
    setBidData,
    setPage,
    handleBidLoading,
} from "../../redux/slice/bidSlice";
import { BID_TABS } from "../../utils/constants";
import BidCard from "./BidCard";
import { getTotalPages } from "../../helpers";
import { Pagination } from "../common/Pagination";
import useSocketSync from "../hooks//useSocketSync";
import useTranslationHook from "../hooks/useTranslationHook";
const Bids = () => {
    const { t } = useTranslationHook();
    const location = useLocation();

    const ACTIVE = "active";
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const bidData = useSelector((state) => state.bid.bidData);
    const bidLoading = useSelector((state) => state.bid.bidLoading);
    const total = useSelector((state) => state.bid.total);
    const pageSize = useSelector((state) => state.bid.page.pageSize);
    const currentPage = useSelector((state) => state.bid.page.currentPage);
    const activeTab = useSelector((state) => state.bid.activeTab);
    const totalPages = useMemo(() => {
        return getTotalPages(total, pageSize);
    }, [total, pageSize]);
    const hashValue = location.hash;
    useEffect(() => {
        return () => {
            dispatch(setActiveTab(BID_TABS[0].key));
            dispatch(handleBidLoading(true));
        };
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (hashValue === "#won") {
            dispatch(setActiveTab(BID_TABS[hashValue === "#won" ? 3 : 0]?.key));
            dispatch(handleBidLoading(false));
            setTimeout(() => dispatch(handleBidLoading(true)), 0);
        }
        //eslint-disable-next-line
    }, [hashValue]);

    useEffect(
        () => {
            const abortController = new AbortController();
            const signal = abortController.signal;

            if (bidLoading) {
                (async () => {
                    const response = await dispatch(
                        handleDiscoverAuctions(
                            {
                                ...(user?.site_id && {
                                    site_id: Number(user.site_id),
                                }),
                                page_size: pageSize,
                                page: currentPage,
                                short_by: "",
                                sort_order: "asc",
                                ...(user?.user_id && {
                                    user_id: Number(user.user_id),
                                    bidder_id: Number(user.user_id),
                                }),
                                ...(activeTab && activeTab === ACTIVE
                                    ? { is_active_bid: 1 }
                                    : {
                                          filter: activeTab,
                                      }),
                            },
                            signal
                        )
                    );
                    const { data } = response || {};
                    dispatch(
                        setBidData({
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
        [bidLoading, currentPage]
    );
    const syncData = useSocketSync(bidData, user?.user_id, "bidsSync");

    return (
        <section className="discover-wrap">
            <div className="container py-5">
                <div className="row">
                    <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <div className="main-heading">
                            <h3>{t("Properties You’ve Bid On")}</h3>
                        </div>
                        <Tabs
                            data={bidData}
                            tab={BID_TABS}
                            Component={BidCard}
                            className="discover-list my-bid"
                            activeTab={activeTab}
                            isLoading={bidLoading}
                            fetchData={(key) => {
                                dispatch(setActiveTab(key));
                                dispatch(handleBidLoading(true));
                            }}
                            syncData={syncData}
                        />
                        {!bidLoading && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => dispatch(setPage(page))}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Bids;
