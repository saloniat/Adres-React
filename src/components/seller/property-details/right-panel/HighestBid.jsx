import React from "react";
import { useSelector } from "react-redux";
import { formatPrice } from "../../../../helpers";
import { guessDateTime } from "../../../../utils/dateUtils";
import useTranslationHook from "../../../hooks/useTranslationHook";

const HighestBid = ({ data, auctionStatus }) => {
    const isSeller = useSelector((state) => state.profile.account);
    let lang = useSelector((state) => state.translation.lang);
    const user = useSelector((state) => state.auth.user);
    const { t } = useTranslationHook();

    const { deposit_amount, property_auction_data } = useSelector(
        (state) => state.seller.property.propertyData
    );

    const startDate = guessDateTime(data?.start_date, "MMM DD", 0, lang);
    const endDate = guessDateTime(
        data?.end_date,
        "MMM DD, YYYY hh:mm A",
        0,
        lang
    );

    const reserveAmount = data?.reserve_amount;
    const highBidAmt = data?.high_bid_amt;
    const bidCount = data?.bid_count || 0;
    const isUserOfferAccepted = data?.offerer_offer_status == 1;
    const offerer_offer_amount = data?.offerer_offer_amount || null;
    const offers_count = data?.offers_count || 0;

    const isReserveMet = reserveAmount <= highBidAmt;
    const isFinalBid = auctionStatus === 3 && isSeller === 1;
    const isOngoingAuction = auctionStatus !== 3;
    const showBids = auctionStatus !== 1;
    const is_selected_highest_bid = data?.is_selected_highest_bid;
    // const selected_highest_bid_user_id = data?.selected_highest_bid_user_id;
    const showFinalHighestBidderMessage =
        parseInt(user?.user_id) === data?.max_bidder_user_id &&
        isReserveMet &&
        auctionStatus === 3;

    const finalBidLabel = isUserOfferAccepted
        ? "Accepted Offer"
        : isSeller === 0 && showFinalHighestBidderMessage
          ? "You Won The Highest Bid"
          : isFinalBid && (isReserveMet || is_selected_highest_bid)
            ? "Final Bid"
            : bidCount === 0
              ? "Starting Price"
              : "Highest Bid";

    const auctionDetails =
        isFinalBid && (!isReserveMet || !is_selected_highest_bid) ? (
            <ul>
                <li>
                    {t(isUserOfferAccepted ? "Offers" : "Bids")}:{" "}
                    <span>
                        {t(isUserOfferAccepted ? offers_count : bidCount)}
                    </span>
                    {/* {t("Bids")}: <span>{t(bidCount)}</span> */}
                </li>
                <li>
                    {t("Deposit")}:{" "}
                    <span>
                        {t("Amount", {
                            amount: formatPrice(deposit_amount, lang),
                        })}
                    </span>
                </li>
            </ul>
        ) : (
            <>
                <div className="time">
                    {startDate}-{endDate}
                </div>
                <div className="auction-id">
                    {`${t("Auction ID")}: 
                    ${t(property_auction_data?.[0]?.auction_unique_id)}`}
                </div>
            </>
        );

    return (
        <div className="bidder-box">
            {!bidCount && auctionStatus === 3 && !isUserOfferAccepted ? (
                <div className="bidder-box">
                    <p className="center">
                        <img src="img/no-bid.svg" alt="" />
                    </p>
                    <h5>{t("No bids are placed")}</h5>
                </div>
            ) : (
                <>
                    {(isUserOfferAccepted ||
                        (isFinalBid &&
                            (isReserveMet || is_selected_highest_bid))) && (
                        <>
                            <p className="center">
                                <img src="/img/trophy.svg" alt="trophy" />
                            </p>
                        </>
                    )}

                    <small>{t(finalBidLabel)}</small>
                    <h5>
                        {t("Amount", {
                            amount: formatPrice(
                                isUserOfferAccepted
                                    ? offerer_offer_amount
                                    : highBidAmt || data?.start_price,
                                lang
                            ),
                        })}
                    </h5>
                    {isSeller === 1 &&
                        (isReserveMet || is_selected_highest_bid) &&
                        auctionStatus === 3 && (
                            <h6>
                                {t(data?.bidder_name?.replace(/\s+NA$/, ""))}
                            </h6>
                        )}

                    {isOngoingAuction ? (
                        <ul>
                            {showBids && (
                                <li>
                                    {t("Bids")}: <span>{bidCount}</span>
                                </li>
                            )}
                            {deposit_amount && (
                                <li>
                                    {t("Deposit")}:{" "}
                                    <span>
                                        {t("Amount", {
                                            amount: formatPrice(
                                                deposit_amount,
                                                lang
                                            ),
                                        })}
                                    </span>
                                </li>
                            )}
                        </ul>
                    ) : (
                        auctionDetails
                    )}
                </>
            )}
        </div>
    );
};

export default React.memo(HighestBid);
