import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useCountdownTimer from "../hooks/useCountdownTimer";
import { AUCTION_STATUS } from "../../utils/constants";
import { getPropertyStatus } from "../../helpers";
import useTranslationHook from "../hooks/useTranslationHook";
import { guessDateTime } from "../../utils/dateUtils";
function CardTimer({ data, onStatusChange, isLiveCard = false }) {
    const start_date = data?.start_date;
    const end_date = data?.end_date;
    const lang = useSelector((state) => state.translation.lang);
    const isListingActive = Number(data?.listing_status_id ?? 0) === 1;
    const { t } = useTranslationHook();
    const isSeller = useSelector((state) => state.profile.account);
    const { status, days, hours, minutes, seconds } = useCountdownTimer(
        isListingActive ? start_date : 0,
        isListingActive ? end_date : 0
    );

    const timer = [
        {
            value: String(days).padStart(2, "0"),
            label: isLiveCard ? "Days" : "d",
        },
        {
            value: String(hours).padStart(2, "0"),
            label: isLiveCard ? "Hours" : "h",
        },
        {
            value: String(minutes).padStart(2, "0"),
            label: isLiveCard ? "Minutes" : "m",
        },
        {
            value: String(seconds).padStart(2, "0"),
            label: isLiveCard ? "Seconds" : "s",
        },
    ];
    const filteredTimer = days > 0 ? timer.slice(0, 3) : timer.slice(1);
    const { label, value } = AUCTION_STATUS[status];
    useEffect(() => {
        if (onStatusChange) {
            onStatusChange(
                isLiveCard
                    ? value
                    : getPropertyStatus(
                          data?.listing_status_id,
                          data?.start_time_left_hr,
                          data?.time_left_hr,
                          data?.reserve_amount <= data?.high_bid_amt,
                          isSeller,
                          true
                      )
            );
        }
    }, [value, isSeller]);

    if (value === 3) {
        return (
            <div className="timer discover">
                <small>{t("Closed On")}</small>
                <h5 className="time">
                    {`${guessDateTime(end_date, "D, MMM YYYY", 0, lang)}`}
                </h5>
            </div>
        );
    }

    return (
        <div className="timer">
            <small>{t(label)}</small>
            {isLiveCard ? (
                <ul>
                    {filteredTimer.map((item, index) => (
                        <React.Fragment key={index}>
                            <li>
                                <h5>
                                    {t(item.value)}
                                    <span>{t(item.label)}</span>
                                </h5>
                            </li>
                        </React.Fragment>
                    ))}
                </ul>
            ) : (
                <h6 className="time">
                    {filteredTimer.map((item, index) => (
                        <React.Fragment key={index}>
                            <span>
                                {item.label === "d"
                                    ? t("days", {
                                          days: item.value,
                                      })
                                    : item.label === "h"
                                      ? t("hours", {
                                            hours: item.value,
                                        })
                                      : item.label === "m"
                                        ? t("minutes", {
                                              minutes: item.value,
                                          })
                                        : t("seconds", {
                                              seconds: item.value,
                                          })}
                            </span>
                            {index < t(filteredTimer.length - 1) && ":"}
                        </React.Fragment>
                    ))}
                </h6>
            )}
        </div>
    );
}

export default React.memo(CardTimer);
