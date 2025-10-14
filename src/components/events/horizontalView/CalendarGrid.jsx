import React from "react";
import EventList from "./EventList";
import moment from "moment";

const CalendarGrid = ({ weekDays, groupedEvents, locale = "en" }) => {
    moment.locale(locale);
    return (
        <div className="calendar-grid">
            {weekDays.map(({ date }) => {
                const m = moment(date);
                return (
                    <div key={date} className="calendar-row">
                        <div className="date-box">
                            <span className="weekday">{m.format("ddd")}</span>
                            <span className="day">{m.format("D")}</span>
                        </div>
                        <EventList events={groupedEvents[date] || []} />
                    </div>
                );
            })}
        </div>
    );
};

export default CalendarGrid;
