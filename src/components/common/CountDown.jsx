import React from "react";
import useCountdownTimer from "../hooks/useCountdownTimer";
import useTranslationHook from "../hooks/useTranslationHook";

const CountDown = ({ startDate, endDate, thresholdsMs }) => {
    const { status, days, hours, minutes, seconds } = useCountdownTimer(
        startDate,
        endDate,
        thresholdsMs
    );
    const { t } = useTranslationHook();

    return (
        <>
            <span>
                {t("days", {
                    days: days,
                })}{" "}
                :
            </span>
            <span>
                {t("hours", {
                    hours: hours,
                })}{" "}
                :
            </span>
            <span>
                {t("minutes", {
                    minutes: minutes,
                })}{" "}
                :
            </span>
            <span>
                {t("seconds", {
                    seconds: seconds,
                })}
            </span>
        </>
    );
};

export default CountDown;
