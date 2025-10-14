import React from "react";
import FullCalendar from "@fullcalendar/react";
import arLocale from "@fullcalendar/core/locales/ar";

const Calendar = (props) => {
    return (
        <FullCalendar
            {...props}
            locale={props.locale === "en" ? props.locale : arLocale}
        />
    );
};

export default Calendar;
