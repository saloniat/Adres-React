import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchPropertyBiddersList,
    fetchPropertyBidsHistory,
    fetchPropertyOffersHistory,
} from "../../../../redux/action/bidHistoryAction";
import { formatPrice, maskName } from "../../../../helpers";
import { guessDateTime } from "../../../../utils/dateUtils";
import useTranslationHook from "../../../hooks/useTranslationHook";
import moment from "moment";

const BidHistory = ({
    propertyId,
    auctionStatus,
    isBidder,
    start_date,
    end_date,
    show_reverse_not_met,
    isReserveMet,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);
    const isSeller = useSelector((state) => state.profile.account);
    const [activeTab, setActiveTab] = useState("active-home");
    const [currentBidPage, setCurrentBidPage] = useState(1);
    const [currentBidderPage, setCurrentBidderPage] = useState(1);
    const [currentOfferPage, setCurrentOfferPage] = useState(1);

    const { bids, bidders, offers, pagination } = useSelector(
        (state) => state.bidHistory
    );
    const user_id = useSelector((state) => state.auth.user?.user_id || null);

    const bidHistory = bids[propertyId] || [];
    const bidderHistory = bidders[propertyId] || [];
    const offerHistory = offers[propertyId] || [];
    const bidCount = pagination?.bids?.[propertyId]?.total || 0;
    const bidderCount = pagination?.bidders?.[propertyId]?.total || 0;
    const offerCount = pagination?.offers?.[propertyId]?.total || 0;

    const hasMoreBids = bidHistory.length < bidCount;
    const hasMoreBidders = bidderHistory.length < bidderCount;
    const hasMoreOffers = offerHistory.length < bidderCount;
    const [viewMoreBids, setViewMoreBids] = useState(false);
    const [viewMoreBidders, setViewMoreBidders] = useState(false);
    const [viewMoreOffers, setViewMoreOffers] = useState(false);

    useEffect(() => {
        const defaultTab =
            auctionStatus === 3 && isBidder ? "active-home" : "offer-home";
        setActiveTab(defaultTab);
    }, [auctionStatus]);

    useEffect(() => {
        dispatch(fetchPropertyBidsHistory(propertyId, currentBidPage));
    }, [currentBidPage]);

    useEffect(() => {
        dispatch(fetchPropertyBiddersList(propertyId, currentBidderPage));
    }, [currentBidderPage]);

    useEffect(() => {
        dispatch(fetchPropertyOffersHistory(propertyId, currentOfferPage));
    }, [currentOfferPage]);

    const observer = useRef();
    const lastItemRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    if (
                        activeTab === "active-home" &&
                        hasMoreBids &&
                        viewMoreBids
                    ) {
                        setCurrentBidPage((prev) => prev + 1);
                    } else if (
                        activeTab === "live-home" &&
                        hasMoreBidders &&
                        viewMoreBidders
                    ) {
                        setCurrentBidderPage((prev) => prev + 1);
                    } else if (
                        activeTab === "offer-home" &&
                        hasMoreOffers &&
                        viewMoreBidders
                    ) {
                        setCurrentOfferPage((prev) => prev + 1);
                    }
                }
            });
            if (node) observer.current.observe(node);
        },
        [activeTab, hasMoreBids, hasMoreBidders, viewMoreBids, viewMoreBidders]
    );

    return (
        <div>
            {/* {auctionStatus === 3 && isBidder && offerCount > 0 && ( */}
            {auctionStatus === 3 && isBidder && <h5>{t("Bid History")}</h5>}
            <ul className="nav nav-pills mb-4">
                {auctionStatus === 3 && isBidder && (
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
                {offerCount > 0 && (
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "offer-home" ? "active" : ""}`}
                            onClick={() => setActiveTab("offer-home")}
                        >
                            {offerCount} {t("Offer")}
                        </button>
                    </li>
                )}
            </ul>

            <div className="tab-content">
                {activeTab === "active-home" && (
                    <div className="tab-pane fade show active">
                        <ul className="hty-list">
                            <li>
                                <h6>
                                    <span>{t("Start Date")}</span>
                                    {start_date
                                        ? guessDateTime(
                                              start_date,
                                              "DD-MM-YYYY",
                                              0,
                                              lang
                                          )
                                        : null}
                                </h6>
                            </li>
                            <li>
                                <h6>
                                    <span>{t("End Date")}</span>
                                    {end_date
                                        ? guessDateTime(
                                              end_date,
                                              "DD-MM-YYYY",
                                              0,
                                              lang
                                          )
                                        : null}
                                </h6>
                            </li>
                            {show_reverse_not_met ? (
                                <li>
                                    <h6>
                                        <span>{t("Reserve Price")}</span>
                                        {isReserveMet
                                            ? t("Reserve price met")
                                            : t("Reserve price not met")}{" "}
                                    </h6>
                                </li>
                            ) : (
                                <></>
                            )}
                        </ul>

                        <ul
                            className={`bid-history ${viewMoreBids ? "more-bid-history" : ""}`}
                        >
                            {bidHistory?.length > 0 ? (
                                (viewMoreBids
                                    ? bidHistory
                                    : bidHistory.slice(0, 4)
                                ).map((bid, index) => {
                                    const isCurrentUser =
                                        Number(user_id) === Number(bid?.user);
                                    const isForfeited =
                                        Number(
                                            bid?.bidder_detail
                                                ?.purchase_forefit_status
                                        ) === 2;

                                    // Find the highest valid (non-forfeited) bid
                                    const highestValidBid = bidHistory
                                        .filter(
                                            (b) =>
                                                b?.bidder_detail
                                                    ?.purchase_forefit_status !==
                                                    2 && !b.is_retracted
                                        )
                                        .reduce(
                                            (maxBid, currentBid) =>
                                                currentBid.start_bid >
                                                (maxBid?.start_bid || 0)
                                                    ? currentBid
                                                    : maxBid,
                                            null
                                        );

                                    const highestBidAmount =
                                        highestValidBid?.start_bid || 0;
                                    const highestBidUser =
                                        highestValidBid?.user;

                                    // Find the highest bid placed by the current user
                                    const userHighestBid = bidHistory
                                        .filter(
                                            (b) =>
                                                Number(b?.user) ===
                                                Number(user_id)
                                        )
                                        .reduce(
                                            (maxBid, currentBid) =>
                                                currentBid.start_bid >
                                                (maxBid?.start_bid || 0)
                                                    ? currentBid
                                                    : maxBid,
                                            null
                                        );

                                    const isUserHighestBid =
                                        userHighestBid &&
                                        userHighestBid.id === bid.id;
                                    const isUserHighestBidder =
                                        highestBidUser === Number(user_id);

                                    // Determine bid status text (Only for highest bid of the user)
                                    let bidStatusText = "";
                                    if (!isForfeited && isUserHighestBid) {
                                        if (isUserHighestBidder) {
                                            bidStatusText = t("Highest Bidder");
                                        } else {
                                            bidStatusText = t(
                                                "Your bid was not the highest this time."
                                            );
                                        }
                                    }

                                    return (
                                        <li
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
                                            {isForfeited && (
                                                <div className="h-bid">
                                                    {t("Forfeited")}
                                                </div>
                                            )}

                                            {!isForfeited &&
                                                bid.is_retracted && (
                                                    <div className="h-bid">
                                                        {t("Retracted")}
                                                    </div>
                                                )}

                                            {/* Show bid status only for the user's highest bid */}
                                            {bid.start_bid !==
                                                highestBidAmount &&
                                                isUserHighestBid && (
                                                    <div className="h-bid">
                                                        {bidStatusText}
                                                    </div>
                                                )}

                                            {/* If the logged-in user is NOT the highest bidder, show "Highest Bid" label on the highest valid bid */}
                                            {!bid.is_retracted &&
                                                bid.start_bid ===
                                                    highestBidAmount && (
                                                    <div className="h-bid">
                                                        {t("Highest Bid")}
                                                    </div>
                                                )}

                                            <div className="row-block">
                                                <div className="name-block">
                                                    <span>
                                                        {isCurrentUser &&
                                                            t("(You)")}
                                                        {Number(isSeller) === 1
                                                            ? `${t(bid?.bidder_detail?.first_name || "")} ${t(
                                                                  bid
                                                                      ?.bidder_detail
                                                                      ?.last_name ||
                                                                      ""
                                                              )}`
                                                            : maskName(
                                                                  `${t(bid?.bidder_detail?.first_name || "")} ${t(
                                                                      bid
                                                                          ?.bidder_detail
                                                                          ?.last_name ||
                                                                          ""
                                                                  )}`
                                                              )}
                                                    </span>{" "}
                                                    {guessDateTime(
                                                        bid?.bid_time,
                                                        "DD MMM YYYY - hh:mm A",
                                                        0,
                                                        lang
                                                    )}
                                                </div>
                                                <div className="bid-block">
                                                    {t("Placed Bid")}{" "}
                                                    <strong>
                                                        {t("Amount", {
                                                            amount: formatPrice(
                                                                bid?.start_bid,
                                                                lang
                                                            ),
                                                        })}
                                                    </strong>
                                                    {/* Always show "Highest Bid" label on the highest valid bid amount */}
                                                    {/* {bid?.max_bid ===
                                                            highestBidAmount && (
                                                            <span className="highest-bid-label">
                                                                {" "}
                                                                (
                                                                {t(
                                                                    "Highest Bid"
                                                                )}
                                                                )
                                                            </span>
                                                        )} */}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <li>{t("No bids are placed")}</li>
                            )}

                            {hasMoreBids && <li ref={lastItemRef}></li>}
                        </ul>
                        {bidCount > 3 && (
                            <div className="view-more">
                                <button
                                    onClick={() =>
                                        setViewMoreBids(!viewMoreBids)
                                    }
                                >
                                    {!viewMoreBids
                                        ? t("View More")
                                        : t("View Less")}
                                    <img
                                        src={`/img/arrow-${viewMoreBids ? "down" : "up"}.svg`}
                                        alt="arrow"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "live-home" && (
                    <div className="tab-pane fade show active">
                        <ul className="hty-list">
                            <li>
                                <h6>
                                    <span>{t("Start Date")}</span>
                                    {start_date
                                        ? guessDateTime(
                                              start_date,
                                              "DD-MM-YYYY",
                                              0,
                                              lang
                                          )
                                        : null}
                                </h6>
                            </li>
                            <li>
                                <h6>
                                    <span>{t("End Date")}</span>
                                    {end_date
                                        ? guessDateTime(
                                              end_date,
                                              "DD-MM-YYYY",
                                              0,
                                              lang
                                          )
                                        : null}
                                </h6>
                            </li>
                            {show_reverse_not_met ? (
                                <li>
                                    <h6>
                                        <span>{t("Reserve Price")}</span>
                                        {isReserveMet
                                            ? t("Reserve price met")
                                            : t("Reserve price not met")}{" "}
                                    </h6>
                                </li>
                            ) : (
                                <></>
                            )}
                        </ul>

                        <ul
                            className={`bid-history ${viewMoreBidders ? "more-bid-history" : ""}`}
                        >
                            {bidderHistory?.length > 0 ? (
                                (viewMoreBidders
                                    ? bidderHistory
                                    : bidderHistory.slice(0, 4)
                                ).map((bidder, index) => (
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
                                                    {t(bidder?.approval_status)}
                                                </strong>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li>{t("No bidder found")}</li>
                            )}

                            {hasMoreBidders && <li ref={lastItemRef}></li>}
                        </ul>
                        {bidderCount > 3 && (
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
                        )}
                    </div>
                )}

                {activeTab === "offer-home" && offerCount > 0 && (
                    <div className="tab-pane fade show active">
                        <ul
                            className={`bid-history ${viewMoreOffers ? "more-bid-history" : ""}`}
                        >
                            {offerHistory?.length > 0 ? (
                                (viewMoreOffers
                                    ? offerHistory
                                    : offerHistory.slice(0, 3)
                                ).map((offer, index) => {
                                    return (
                                        <li key={offer.id}>
                                            <div className="offer-block">
                                                <div className="name-block">
                                                    {Number(isSeller) === 1
                                                        ? `${t(offer?.offerer_detail?.first_name || "")} ${t(
                                                              offer
                                                                  ?.offerer_detail
                                                                  ?.last_name ||
                                                                  ""
                                                          )}`
                                                        : maskName(
                                                              `${t(offer?.offerer_detail?.first_name || "")} ${t(
                                                                  offer
                                                                      ?.offerer_detail
                                                                      ?.last_name ||
                                                                      ""
                                                              )}`
                                                          )}{" "}
                                                </div>
                                                <div className="bid-block">
                                                    {t("Date")}{" "}
                                                    <strong>
                                                        {guessDateTime(
                                                            offer?.added_on,
                                                            "DD MMM YYYY - hh:mm A",
                                                            0,
                                                            lang
                                                        )}
                                                    </strong>
                                                </div>
                                                <div className="bid-block">
                                                    {t("Offer Amount")}{" "}
                                                    <strong>
                                                        {t("Amount", {
                                                            amount: formatPrice(
                                                                offer?.buy_now_amount,
                                                                lang
                                                            ),
                                                        })}
                                                    </strong>
                                                </div>
                                                <div className="bid-block">
                                                    {t("Approval Status")}{" "}
                                                    <strong>
                                                        {t(
                                                            offer?.approval_status
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <li>{t("No offer submitted")}</li>
                            )}

                            {hasMoreOffers && <li ref={lastItemRef}></li>}
                        </ul>
                        {offerCount > 3 && (
                            <div className="view-more">
                                <button
                                    onClick={() =>
                                        setViewMoreOffers(!viewMoreOffers)
                                    }
                                >
                                    {!viewMoreOffers
                                        ? t("View More")
                                        : t("View Less")}
                                    <img
                                        src={`/img/arrow-${viewMoreOffers ? "down" : "up"}.svg`}
                                        alt="arrow"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BidHistory;
