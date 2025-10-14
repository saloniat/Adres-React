import React from "react";
import moment from "moment";
import useTranslationHook from "../../hooks/useTranslationHook";

const WeekNavigator = ({ startDay, endDay, changeWeek, locale = "en" }) => {
    const { t } = useTranslationHook();

    const start = moment(startDay.date).locale(locale);
    const end = moment(endDay.date).locale(locale);
    return (
        <div>
            <h6>{t("This Week")}</h6>
            <div className="week-header">
                <span className="week-range">
                    {start.format("DD")} - {end.format("DD MMMM YYYY")}
                </span>
                <div className="week-navigation">
                    <button onClick={() => changeWeek(-1)}>&lt;</button>
                    <button onClick={() => changeWeek(1)}>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default WeekNavigator;
