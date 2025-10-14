import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import Calendar from "../common/Calendar";
import dayGridPlugin from "@fullcalendar/daygrid";
import { monthNames } from "../../utils/dateUtils";
import { useDispatch, useSelector } from "react-redux";
import { handleDeleteConfirmationModal } from "../../redux/slice/modalSlice";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import { toggleFavouriteStatus } from "../../redux/slice/buyerSlice";
import { toggleBidFavouriteStatus } from "../../redux/slice/bidSlice";
import { togglePropertyLike } from "../../redux/action/sellerAction";
import { fetchPropertyEvent } from "../../redux/action/eventAction";
import {
    handleSelectedEvent,
    toggleEventFavouriteStatus,
} from "../../redux/slice/eventSlice";
import useTranslationHook from "../hooks/useTranslationHook";
import HorizontalView from "./horizontalView/HorizontalView";
import { createSlug } from "../../helpers";
import Tooltip from "rc-tooltip";
import interactionPlugin from '@fullcalendar/interaction';
const Events = () => {
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    let lang = useSelector((state) => state.translation.lang);
    const [isHorizontal, setIsHorizontal] = useState(true);
    const [eventDate, setEventDate] = useState();
    const propertiesEvent = useSelector((state) => state.event.propertiesEvent);

    const selectedEvent = useSelector((state) => state.event.selectedEvent);

    const submitReaction = (id, isLiked = false) => {
        const formData = {
            domain: 3,
            property: id || selectedEvent,
            ...(user?.user_id && { user: Number(user.user_id) }),
        };
        dispatch(togglePropertyLike(formData));

        dispatch(
            toggleEventFavouriteStatus(
                propertiesEvent?.events.map((ele) =>
                    ele.id === (id || selectedEvent)
                        ? { ...ele, liked: !ele.liked }
                        : ele
                )
            )
        );

        toast.success(
            t(`${isLiked ? "Added to" : "Removed from"} favourite list`)
        );
    };

    const handleWeekChange = async (info) => {
        if (JSON.stringify(eventDate) !== JSON.stringify(info)) {
            setEventDate(info);
            const startDate = moment(info?.start).format("YYYY-MM-DD");
            const endDate = moment(info?.end).format("YYYY-MM-DD");
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
        }
    };
    return (
        <>
            <section className="events-wrap">
                <div className="container py-5">
                    <div className="row">
                        <div
                            className="col-lg-12 wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            <div className="main-heading">
                                <h3>{t("Events")}</h3>
                                <ul
                                    className="nav nav-pills"
                                    id="pills-tab1"
                                    role="tablist"
                                >
                                    <li
                                        className="nav-item "
                                        role="presentation"
                                    >
                                        <button
                                            className="nav-link active"
                                            onClick={() =>
                                                setIsHorizontal(true)
                                            }
                                            id="event-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#event-h-tab"
                                            type="button"
                                            role="tab"
                                        >
                                            <img
                                                src="img/event-h-icon.svg"
                                                alt="event-h-icon"
                                            />
                                        </button>
                                    </li>
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className="nav-link"
                                            id="live-tab"
                                            onClick={() =>
                                                setIsHorizontal(false)
                                            }
                                            data-bs-toggle="pill"
                                            data-bs-target="#event-v-tab"
                                            type="button"
                                            role="tab"
                                            aria-controls="pills-profile"
                                            aria-selected="false"
                                        >
                                            <img
                                                src="img/event-v-icon.svg"
                                                alt="event-h-icon"
                                            />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-content" id="pills-tabContent1">
                                <>
                                    {isHorizontal ? (
                                        <>
                                            <h6>{t("This Week")}</h6>
                                            <div className="horizontal-view">
                                                <Calendar
                                                    locale={lang}
                                                    plugins={[dayGridPlugin, interactionPlugin]}
                                                    headerToolbar={{
                                                        right: "prev,next",
                                                    }}
                                                    initialView={"dayGridWeek"}
                                                    events={
                                                        Array.isArray(
                                                            propertiesEvent?.events
                                                        ) &&
                                                            propertiesEvent?.events
                                                                ?.length > 0
                                                            ? propertiesEvent.events
                                                            : []
                                                    }
                                                    views={{
                                                        dayGridWeek: {
                                                            dayHeaderFormat: {
                                                                weekday:
                                                                    "narrow",
                                                            },
                                                            //             titleFormat: ({
                                                            //                 start,
                                                            //                 end,
                                                            //             }) => {
                                                            //                 return `${String(start.day).padStart(2, "0")} -
                                                            // ${`${String(end.day).padStart(2, "0")} ${monthNames[end.month]} ${end.year}`}`;
                                                            //             },
                                                            titleFormat: (
                                                                { start, end },
                                                                locale = lang
                                                            ) => {
                                                                const startDate =
                                                                    moment(
                                                                        start
                                                                    ).locale(
                                                                        locale
                                                                    );
                                                                const endDate =
                                                                    moment(
                                                                        end
                                                                    ).locale(
                                                                        locale
                                                                    );

                                                                return `${startDate.format("DD")} - ${endDate.format("DD MMMM YYYY")}`;
                                                            },
                                                        },
                                                    }}
                                                    height={500}
                                                    eventDisplay="block"
                                                    displayEventTime={false}
                                                    datesSet={(info) =>
                                                        handleWeekChange(info)
                                                    } //datesSet is called after the new date range has been rendered
                                                    eventDidMount={(info) => {
                                                        const { status } =
                                                            info.event
                                                                .extendedProps;
                                                        const eventStartDate =
                                                            info.event.start

                                                        const eventEndDate =
                                                            info.event.end
                                                        const currentDate =
                                                            new Date();
                                                        if (
                                                            currentDate >= eventStartDate && currentDate <= eventEndDate && status !== "Sold out"
                                                        ) {
                                                            info.el.style.backgroundColor =
                                                                 "#DBFAE3";
                                                        } else {
                                                            if (
                                                                currentDate < eventStartDate
                                                            ) {
                                                                info.el.style.backgroundColor =
                                                                    "white";
                                                            } else {
                                                                info.el.style.backgroundColor =
                                                                    "#D3D3D3";
                                                            }
                                                        }
                                                    }}
                                                    eventContent={(
                                                        eventInfo
                                                    ) => {
                                                        const {
                                                            price,
                                                            liked,
                                                            title_ar,
                                                        } =
                                                            eventInfo.event
                                                                .extendedProps;
                                                        const id =
                                                            eventInfo.event.id;
                                                        const heartImage = liked
                                                            ? "img/heart-icon-r.svg"
                                                            : "img/heart-icon.svg";
                                                        const startDate =
                                                            moment(
                                                                eventInfo.event
                                                                    .start
                                                            ).format(
                                                                "DD/MM/YYYY"
                                                            );
                                                        const endDate = moment(
                                                            eventInfo.event.end
                                                        ).format("DD/MM/YYYY");
                                                        const startTime =
                                                            moment(
                                                                eventInfo.event
                                                                    .start
                                                            ).format("hh:mmA");
                                                        const endTime = moment(
                                                            eventInfo.event.end
                                                        ).format("hh:mmA");

                                                        const showOnlyTime =
                                                            startDate ===
                                                            endDate;
                                                        return (
                                                            <Tooltip
                                                                overlay={
                                                                    <span>
                                                                        {showOnlyTime
                                                                            ? `${startTime}-${endTime}`
                                                                            : `${startDate}, ${startTime} - ${endDate}, ${endTime}`}
                                                                    </span>
                                                                }

                                                                placement="bottom"
                                                            >
                                                                <div
                                                                    onClick={() => {
                                                                        window.open(
                                                                            "/property/detail/" +
                                                                            createSlug(
                                                                                id,
                                                                                `${eventInfo.event.title}, ${eventInfo.event.extendedProps.country}`
                                                                            ),
                                                                            "_blank",
                                                                            "noopener,noreferrer"
                                                                        );
                                                                    }}
                                                                >
                                                                    {/* <div className="time">
                                                                        <img
                                                                            src="/img/calender-icon.svg"
                                                                            alt="calender"
                                                                        />
                                                                        {showOnlyTime
                                                                            ? `${startTime}-${endTime}`
                                                                            : `${startDate}, ${startTime} - ${endDate}, ${endTime}`}
                                                                    </div> */}

                                                                    <Tooltip
                                                                        overlay={
                                                                            <span>
                                                                                {t(
                                                                                    lang ===
                                                                                        "en"
                                                                                        ? eventInfo
                                                                                            .event
                                                                                            .title
                                                                                        : title_ar ||
                                                                                        ""
                                                                                )}
                                                                            </span>
                                                                        }
                                                                        placement="top"
                                                                    >
                                                                        <i
                                                                            {...(showOnlyTime && {
                                                                                className:
                                                                                    "title",
                                                                            })}
                                                                        >
                                                                            {t(
                                                                                lang ===
                                                                                    "en"
                                                                                    ? eventInfo
                                                                                        .event
                                                                                        .title
                                                                                    : title_ar ||
                                                                                    ""
                                                                            )}
                                                                        </i>
                                                                    </Tooltip>

                                                                    <button
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            if (
                                                                                liked
                                                                            ) {
                                                                                dispatch(
                                                                                    handleDeleteConfirmationModal(
                                                                                        true
                                                                                    )
                                                                                );
                                                                                dispatch(
                                                                                    handleSelectedEvent(
                                                                                        Number(
                                                                                            id
                                                                                        )
                                                                                    )
                                                                                );
                                                                            } else {
                                                                                submitReaction(
                                                                                    Number(
                                                                                        id
                                                                                    ),
                                                                                    true
                                                                                );
                                                                            }
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={
                                                                                heartImage
                                                                            }
                                                                            alt={
                                                                                liked
                                                                                    ? "Liked"
                                                                                    : "Not Liked"
                                                                            }
                                                                        />
                                                                    </button>

                                                                    <p>
                                                                        {t(
                                                                            "Amount",
                                                                            {
                                                                                amount: price,
                                                                            }
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </Tooltip>
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <HorizontalView />
                                    )}
                                </>
                            </div>
                        </div>
                    </div>
                </div>
                <DeleteConfirmationModal
                    title={t("Remove from favourite?")}
                    content={t(
                        "Are you sure about removing it from your favourite collections?"
                    )}
                    handleModalCancel={() =>
                        dispatch(handleDeleteConfirmationModal(false))
                    }
                    handleModalOpen={() =>
                        dispatch(handleDeleteConfirmationModal(true))
                    }
                    handleModalConfirm={() => {
                        submitReaction();
                        dispatch(handleDeleteConfirmationModal(false));
                    }}
                />
            </section>
        </>
    );
};

export default Events;
