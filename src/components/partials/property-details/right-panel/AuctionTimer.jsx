import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useCountdownTimer from "../../../hooks/useCountdownTimer";
import { AUCTION_STATUS } from "../../../../utils/constants";
import useTranslationHook from "../../../hooks/useTranslationHook";
import { handleRetractBidModal } from "../../../../redux/slice/modalSlice";
function AuctionTimer({ data, onStatusChange }) {
    const dispatch = useDispatch();

    const isListingActive = Number(data?.listing_status_id) === 1;

    const { status, days, hours, minutes, seconds } = useCountdownTimer(
        isListingActive ? data?.start_date : 0,
        isListingActive ? data?.end_date : 0
    );
    const { t } = useTranslationHook();

    const timer = [
        { value: String(days).padStart(2, "0"), label: "Days" },
        { value: String(hours).padStart(2, "0"), label: "Hours" },
        { value: String(minutes).padStart(2, "0"), label: "Mins" },
        { value: String(seconds).padStart(2, "0"), label: "Secs" },
    ];
    const filteredTimer = days > 0 ? timer.slice(0, 3) : timer.slice(1);
    const { label, value } = AUCTION_STATUS[status];

    useEffect(() => {
        if (onStatusChange) {
            onStatusChange(value);
        }
    }, [value, onStatusChange]);

    const showRetractButton =
        value === 2 &&
        data?.time_left_hr > 30 &&
        data?.my_max_bid_val &&
        Boolean(data?.is_bid_retracted) === false &&
        Number(data?.high_bid_amt) === Number(data?.my_max_bid_val);
    return (
        <>
            <div className="bid-timer">
                {showRetractButton && (
                    <div className="retract-btn">
                        <button
                            className="btn btn-white btn-sm"
                            // disabled={isRetractBidEnabled}
                            onClick={() =>
                                dispatch(handleRetractBidModal(true))
                            }
                        >
                            {t("Retract Bid")}
                        </button>
                    </div>
                )}
                <small>{t(label)}</small>
                <ul>
                    {filteredTimer.map((item, index) => (
                        <React.Fragment key={index}>
                            <li>
                                <h5>
                                    {t(item.value)}
                                    <span>{t(item.label)}</span>
                                </h5>
                            </li>
                            {index < filteredTimer.length - 1 && (
                                <li className="separate">:</li>
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default React.memo(AuctionTimer);
