import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./EventsCalendar.css";
import { getWeekDays, groupEventsByDate } from "../../../utils";
import WeekNavigator from "./WeekNavigator";
import CalendarGrid from "./CalendarGrid";
import { fetchPropertyEvent } from "../../../redux/action/eventAction";
import moment from "moment";

const HorizontalView = () => {
    const dispatch = useDispatch();
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const weekDays = getWeekDays(currentWeekStart);
    const user = useSelector((state) => state.auth.user);
    let lang = useSelector((state) => state.translation.lang);
    const propertiesEvent = useSelector((state) => state.event.propertiesEvent);
    const groupedEvents = groupEventsByDate(
        propertiesEvent?.events,
        weekDays[0].date,
        weekDays[6].date
    );
    useEffect(() => {
        handleFetchPropertyEvent();
    }, [currentWeekStart]);

    const handleFetchPropertyEvent = async () => {
        const startDate = moment(currentWeekStart)
            .startOf("week")
            .format("YYYY-MM-DD");
        const endDate = moment(currentWeekStart)
            .endOf("week")
            .format("YYYY-MM-DD");
        await dispatch(
            fetchPropertyEvent(
                {
                    ...(user?.site_id && { site_id: user.site_id }),
                    ...(user?.user_id && { user_id: user.user_id }),
                    start_date: startDate
                        ? startDate
                        : moment()
                              .startOf("isoWeek")
                              .utcOffset(0)
                              .format("YYYY-MM-DD"),
                    end_date: endDate
                        ? endDate
                        : moment()
                              .endOf("isoWeek")
                              .utcOffset(0)
                              .format("YYYY-MM-DD"),
                },
                {},
                lang
            )
        );
    };
    const changeWeek = (direction) => {
        setCurrentWeekStart((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + direction * 7);
            return newDate;
        });
    };

    return (
        <div className="calendar-container">
            <WeekNavigator
                startDay={weekDays[0]}
                endDay={weekDays[6]}
                changeWeek={changeWeek}
                locale={lang}
            />
            <CalendarGrid
                weekDays={weekDays}
                groupedEvents={groupedEvents}
                locale={lang}
            />
        </div>
    );
};

export default HorizontalView;
