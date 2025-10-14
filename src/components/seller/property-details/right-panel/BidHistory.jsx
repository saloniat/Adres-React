import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    bidHistoryAction,
    fetchPropertyBiddersList,
    fetchPropertyBidsHistory,
    fetchPropertyOffersHistory,
} from "../../../../redux/action/bidHistoryAction";
import { formatPrice, maskName } from "../../../../helpers";
import { guessDateTime } from "../../../../utils/dateUtils";
import useTranslationHook from "../../../hooks/useTranslationHook";
import { Pagination } from "../../../common/Pagination";

const HighestBidLabel = ({
    start_bid,
    highestBid,
    is_retracted,
    name,
    amount,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    useEffect(() => {
        if (start_bid === highestBid && !is_retracted) {
            dispatch(
                bidHistoryAction.handleHighestBidder({
                    name,
                    amount,
                })
            );
        }
    }, []);

    if (!(start_bid === highestBid && !is_retracted)) {
        return <></>;
    }

    return <span className="highest">{t("Highest Bid")}</span>;
};

const BidHistory = ({ propertyId, auctionStatus, biddingData }) => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);
    const isSeller = useSelector((state) => state.profile.account);

    const [activeTab, setActiveTab] = useState("active-home");
    const [currentBidPage, setCurrentBidPage] = useState(1);
    const [currentBidderPage, setCurrentBidderPage] = useState(1);
    const [currentOfferPage, setCurrentOfferPage] = useState(1);
    const [highestBid, setHighestBid] = useState(0);

    const { sellerBids, sellerBidders, sellerOffers, parentProperty } =
        useSelector((state) => state.bidHistory);
    const user_id = useSelector((state) => state.auth.user?.user_id || null);
    const { property_auction_data } = useSelector(
        (state) => state.seller.property.propertyData
    );
    const bidHistory = sellerBids?.data || [];
    const bidderHistory = sellerBidders?.data || [];
    const offerHistory = sellerOffers?.data || [];
    const bidCount = sellerBids?.total || 0;
    const bidderCount = sellerBidders?.total || 0;
    const offerCount = sellerOffers?.total || 0;
    const pageSize = 4;
    useEffect(() => {
        const defaultTab = auctionStatus === 1 ? "offer-home" : "active-home";
        setActiveTab(defaultTab);
    }, [auctionStatus]);
    const loadBidHistory = () => {
        dispatch(
            fetchPropertyBidsHistory(
                parentProperty || propertyId,
                currentBidPage,
                pageSize,
                true
            )
        );
    };

    const loadBiddersList = () => {
        dispatch(
            fetchPropertyBiddersList(
                parentProperty || propertyId,
                currentBidderPage,
                pageSize,
                true
            )
        );
    };

    const loadOffersHistory = () => {
        dispatch(
            fetchPropertyOffersHistory(
                parentProperty || propertyId,
                currentOfferPage,
                pageSize,
                true
            )
        );
    };

    const refreshBidHistory = () => {
        setHighestBid(0);
        if (auctionStatus === 1) {
            currentOfferPage !== 1
                ? setCurrentOfferPage(1)
                : loadOffersHistory();
        } else {
            currentBidPage !== 1 ? setCurrentBidPage(1) : loadBidHistory();
            currentBidderPage !== 1
                ? setCurrentBidderPage(1)
                : loadBiddersList();
            currentOfferPage !== 1
                ? setCurrentOfferPage(1)
                : loadOffersHistory();
        }
    };

    useEffect(() => {
        loadBidHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBidPage, parentProperty]);

    useEffect(() => {
        loadBiddersList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBidderPage, parentProperty]);

    useEffect(() => {
        loadOffersHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentOfferPage, parentProperty]);

    const handlePageChange = (page) => {
        if (activeTab === "active-home") setCurrentBidPage(page);
        else if (activeTab === "live-home") setCurrentBidderPage(page);
        else if (activeTab === "offer-home") setCurrentOfferPage(page);
    };

    const auctionDetails = (
        <div className="bids-box">
            <div className="block">
                <div className="box">
                    <h6>
                        <span>{t("Auction ID")}</span>
                        {property_auction_data?.[0]?.auction_unique_id}
                    </h6>
                </div>
            </div>
            <div className="block">
                <div className="box">
                    <h6>
                        <span>{t("Start Date")}</span>
                        {guessDateTime(
                            biddingData?.start_date,
                            "DD-MM-YYYY",
                            0,
                            lang
                        )}
                    </h6>
                </div>
            </div>
            <div className="block">
                <div className="box">
                    <h6>
                        <span>{t("End Date")}</span>
                        {guessDateTime(
                            biddingData?.end_date,
                            "DD-MM-YYYY",
                            0,
                            lang
                        )}
                    </h6>
                </div>
            </div>
            <div className="block">
                <div className="box">
                    <h6>
                        <span>{t("Reserve Price")}</span>
                        {formatPrice(biddingData?.reserve_amount, lang)}
                    </h6>
                </div>
            </div>
        </div>
    );

    return (
        <div className="col-lg-12">
            <div className="main-heading">
                <h5>{t("Bid History")} </h5>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => refreshBidHistory()}
                >
                    <i className="fa fa-refresh" aria-hidden="true"></i>{" "}
                    {t("Refresh")}
                </button>
            </div>

            <ul className="nav nav-pills mb-4">
                {auctionStatus != 1 && (
                    <>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "active-home" ? "active" : ""}`}
                                onClick={() => setActiveTab("active-home")}
                            >
                                {t("discover card total bids", {
                                    totalBids: bidCount,
                                })}
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "live-home" ? "active" : ""}`}
                                onClick={() => setActiveTab("live-home")}
                            >
                                {t("Bidder Count", {
                                    bidder: bidderCount,
                                })}
                            </button>
                        </li>
                    </>
                )}

                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "offer-home" ? "active" : ""}`}
                        onClick={() => setActiveTab("offer-home")}
                    >
                        {t("Offers Count", {
                            offers: offerCount,
                        })}
                        {/* {offerCount} {t("Offers")} */}
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {auctionStatus != 1 && activeTab === "active-home" && (
                    <div className="tab-pane fade show active">
                        {auctionDetails}
                        <div className="bid-table">
                            <table className="table table-responsive ">
                                <thead>
                                    <tr>
                                        <th>{t("Name")}</th>
                                        <th>{t("Date and Time")}</th>
                                        <th>{t("Placed Bid")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bidHistory?.length > 0 ? (
                                        bidHistory
                                            .slice(0, pageSize)
                                            .map((bid) => {
                                                const isForfeited =
                                                    Number(
                                                        bid?.bidder_detail
                                                            ?.purchase_forefit_status
                                                    ) === 2;

                                                // Find the highest valid (non-forfeited) bid
                                                const highestValidBid =
                                                    bidHistory
                                                        .filter(
                                                            (b) =>
                                                                b?.bidder_detail
                                                                    ?.purchase_forefit_status !==
                                                                    2 &&
                                                                !b.is_retracted
                                                        )
                                                        .reduce(
                                                            (
                                                                maxBid,
                                                                currentBid
                                                            ) =>
                                                                currentBid.start_bid >
                                                                (maxBid?.start_bid ||
                                                                    0)
                                                                    ? currentBid
                                                                    : maxBid,
                                                            null
                                                        );
                                                const highestBidAmount =
                                                    highestValidBid?.start_bid ||
                                                    0;
                                                if (
                                                    highestBidAmount >
                                                    highestBid
                                                )
                                                    setHighestBid(
                                                        highestBidAmount
                                                    );
                                                const highestBidUser =
                                                    highestValidBid?.user;

                                                // Find the highest bid placed by the current user
                                                const userHighestBid =
                                                    bidHistory
                                                        .filter(
                                                            (b) =>
                                                                Number(
                                                                    b?.user
                                                                ) ===
                                                                Number(user_id)
                                                        )
                                                        .reduce(
                                                            (
                                                                maxBid,
                                                                currentBid
                                                            ) =>
                                                                currentBid.start_bid >
                                                                (maxBid?.start_bid ||
                                                                    0)
                                                                    ? currentBid
                                                                    : maxBid,
                                                            null
                                                        );

                                                const isUserHighestBid =
                                                    userHighestBid &&
                                                    userHighestBid.id ===
                                                        bid.id;
                                                const isUserHighestBidder =
                                                    highestBidUser ===
                                                    Number(user_id);

                                                return (
                                                    <tr
                                                        key={bid.id}
                                                        className={
                                                            isForfeited
                                                                ? "low-bid forefit"
                                                                : bid?.is_retracted
                                                                  ? "low-bid forefit"
                                                                  : bid.start_bid ===
                                                                      highestBidAmount
                                                                    ? "higest-bid"
                                                                    : isUserHighestBid &&
                                                                        !isUserHighestBidder
                                                                      ? "low-bid"
                                                                      : ""
                                                        }
                                                    >
                                                        <td>
                                                            <span className="name">
                                                                {t(
                                                                    `${bid?.bidder_detail?.first_name || ""} ${bid?.bidder_detail?.last_name || ""} `
                                                                )}
                                                            </span>
                                                            <HighestBidLabel
                                                                start_bid={
                                                                    bid.start_bid
                                                                }
                                                                highestBid={
                                                                    highestBid
                                                                }
                                                                is_retracted={
                                                                    bid.is_retracted
                                                                }
                                                                name={t(
                                                                    `${bid?.bidder_detail?.first_name || ""} ${bid?.bidder_detail?.last_name || ""} `
                                                                )}
                                                                amount={
                                                                    bid?.start_bid
                                                                }
                                                            />
                                                            {/* {bid.start_bid ===
                                                                highestBid &&
                                                                !bid.is_retracted && (
                                                                    <span className="highest">
                                                                        {t(
                                                                            "Highest Bid"
                                                                        )}
                                                                    </span>
                                                                )} */}
                                                            {isForfeited && (
                                                                <span className="forefit">
                                                                    {t(
                                                                        "Forfeited"
                                                                    )}
                                                                </span>
                                                            )}
                                                            {!isForfeited &&
                                                                bid.is_retracted && (
                                                                    <span className="forefit">
                                                                        {t(
                                                                            "Retracted"
                                                                        )}
                                                                    </span>
                                                                )}
                                                        </td>
                                                        <td>
                                                            {guessDateTime(
                                                                bid?.bid_time,
                                                                "DD MMM YYYY - hh:mm A",
                                                                0,
                                                                lang
                                                            )}
                                                        </td>
                                                        <td>
                                                            {t("Amount", {
                                                                amount: formatPrice(
                                                                    bid?.start_bid,
                                                                    lang
                                                                ),
                                                            })}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                    ) : (
                                        <tr>{t("No bids are placed")}</tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={currentBidPage}
                            totalPages={Math.ceil(bidCount / pageSize)}
                            onPageChange={handlePageChange}
                            shouldScroll={false}
                        />
                    </div>
                )}

                {auctionStatus != 1 && activeTab === "live-home" && (
                    <div className="tab-pane fade show active">
                        <ul className={`bid-history`}>
                            {auctionDetails}
                            {bidderHistory?.length > 0 ? (
                                bidderHistory
                                    .slice(0, pageSize)
                                    .map((bidder, index) => (
                                        <li key={index}>
                                            <div className="row-block">
                                                <div className="name-block">
                                                    <span>
                                                        {Number(isSeller) === 1
                                                            ? `${t(bidder?.bidder_detail?.first_name)} ${t(bidder?.bidder_detail?.last_name || "")}`
                                                            : maskName(
                                                                  `${t(bidder?.bidder_detail?.first_name)} ${t(bidder?.bidder_detail?.last_name || "")}`
                                                              )}
                                                    </span>{" "}
                                                    {guessDateTime(
                                                        bidder?.approval_date,
                                                        "DD MMM YYYY - hh:mm A",
                                                        0,
                                                        lang
                                                    )}
                                                </div>
                                                <div className="bid-block">
                                                    {t("Approval Status")}{" "}
                                                    <strong>
                                                        {t(
                                                            bidder?.approval_status
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                            ) : (
                                <li>{t("No bidder found")}</li>
                            )}
                        </ul>
                        <Pagination
                            currentPage={currentBidderPage}
                            totalPages={Math.ceil(bidderCount / pageSize)}
                            onPageChange={handlePageChange}
                            shouldScroll={false}
                        />
                        {/* {bidderCount > 3 && (
                            <div className="view-more">
                                <button
                                    onClick={() =>
                                        setViewMoreBidders(!viewMoreBidders)
                                    }
                                >
                                    {!viewMoreBidders
                                        ? t("View More")
                                        : t("View Less")}
                                    <img
                                        src={`/img/arrow-${viewMoreBidders ? "down" : "up"}.svg`}
                                        alt="arrow"
                                    />
                                </button>
                            </div>
                        )} */}
                    </div>
                )}

                {activeTab === "offer-home" && (
                    <div className="tab-pane fade show active">
                        {auctionDetails}
                        <div className="bid-table">
                            <table className="table table-responsive ">
                                <thead>
                                    <tr>
                                        <th>{t("Name")}</th>
                                        <th>{t("Date and Time")}</th>
                                        <th>{t("Offer Amount")}</th>
                                        <th>{t("Approval Status")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offerHistory?.length > 0 ? (
                                        offerHistory
                                            .slice(0, pageSize)
                                            .map((offer) => {
                                                return (
                                                    <tr
                                                        key={offer.id}
                                                        className=""
                                                    >
                                                        <td>
                                                            <span className="name">
                                                                {t(
                                                                    `${offer?.offerer_detail?.first_name || ""} ${offer?.offerer_detail?.last_name || ""} `
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {guessDateTime(
                                                                offer?.added_on,
                                                                "DD MMM YYYY - hh:mm A",
                                                                0,
                                                                lang
                                                            )}
                                                        </td>
                                                        <td>
                                                            {formatPrice(
                                                                offer?.buy_now_amount,
                                                                lang
                                                            )}
                                                        </td>
                                                        <td>
                                                            {t(
                                                                offer?.approval_status
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                    ) : (
                                        <tr>{t("No offers received")}</tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={currentOfferPage}
                            totalPages={Math.ceil(offerCount / pageSize)}
                            onPageChange={handlePageChange}
                            shouldScroll={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BidHistory;
