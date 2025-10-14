import React from "react";
import { useSelector } from "react-redux";
import { formatPrice } from "../../../../helpers";
import { guessDateTime } from "../../../../utils/dateUtils";
import useTranslationHook from "../../../hooks/useTranslationHook";

const HighestBid = ({ data, auctionStatus, isForeFitted }) => {
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

    const isReserveMet = reserveAmount <= highBidAmt;
    const isFinalBid = auctionStatus === 3 && isSeller === 1;
    const isOngoingAuction = auctionStatus !== 3;
    const showBids = auctionStatus !== 1;
    const showReserve = isSeller === 1 && auctionStatus === 1;
    const is_selected_highest_bid = data?.is_selected_highest_bid;
    const selected_highest_bid_user_id = parseInt(
        data?.selected_highest_bid_user_id
    );
    const isSellerChooseBid = user?.isVerified
        ? user?.isVerified === true
        : false;
    const showFinalHighestBidderMessage =
        parseInt(user?.user_id) === data?.max_bidder_user_id &&
        isReserveMet &&
        auctionStatus === 3;
    const isUserOfferAccepted =
        data?.offerer_offer_status == 1 &&
        parseInt(user?.user_id) == parseInt(data?.offerer_user_id);
    const offerer_offer_amount = data?.offerer_offer_amount || null;

    const finalBidLabel = isUserOfferAccepted
        ? "Your offer has been accepted"
        : isSeller === 0 && showFinalHighestBidderMessage
          ? "You Won The Highest Bid"
          : isFinalBid && (isReserveMet || is_selected_highest_bid)
            ? "Final Bid"
            : bidCount === 0
              ? "Starting Price"
              : isForeFitted
                ? "You won the Highest Bid but choose to forfeit"
                : "Highest Bid";

    const auctionDetails =
        isFinalBid && (!isReserveMet || !is_selected_highest_bid) ? (
            <ul>
                <li>
                    {t("Bids")}: <span>{t(bidCount)}</span>
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
                <div className="time">{`${startDate} - ${endDate}`}</div>
                <div className="auction-id">
                    {`${t("Auction ID")}: 
                    ${t(property_auction_data?.[0]?.auction_unique_id)}`}
                </div>
            </>
        );
    return (
        <div
            className={`bidder${(showFinalHighestBidderMessage && isSeller === 0) || (is_selected_highest_bid && parseInt(user?.user_id) === selected_highest_bid_user_id) ? "won" : ""}-box ${
                isForeFitted ? "forfeit-bg" : ""
            }`}
        >
            {(isUserOfferAccepted ||
                (isFinalBid && (isReserveMet || is_selected_highest_bid))) && (
                <>
                    <p className="text-center">
                        <img src="/img/trophy.svg" alt="trophy" />
                    </p>
                </>
            )}

            <small
                className={
                    isUserOfferAccepted ||
                    (showFinalHighestBidderMessage && isSeller === 0)
                        ? "won"
                        : ""
                }
            >
                {t(finalBidLabel)}
            </small>
            <h5>
                {t("Amount", {
                    amount: formatPrice(
                        isForeFitted
                            ? data?.my_high_bid_amt
                            : isUserOfferAccepted
                              ? offerer_offer_amount
                              : highBidAmt || data?.start_price,
                        lang
                    ),
                })}
            </h5>

            {/* {isSeller === 1 &&
                (isReserveMet || is_selected_highest_bid) &&
                auctionStatus === 3 && (
                    <small className="text-center mb-2">
                        {t(data?.bidder_name?.replace(/\s+NA$/, ""))}
                    </small>
                )} */}

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
                                    amount: formatPrice(deposit_amount, lang),
                                })}
                            </span>
                        </li>
                    )}
                    {showReserve && (
                        <li>
                            {t("Reserved")}:{" "}
                            <span>
                                {t("Amount", {
                                    amount: formatPrice(reserveAmount, lang),
                                })}
                            </span>
                        </li>
                    )}
                </ul>
            ) : (
                auctionDetails
            )}
        </div>
    );
};

export default React.memo(HighestBid);
