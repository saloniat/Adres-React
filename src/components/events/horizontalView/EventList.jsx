import React from "react";
import { toast } from "react-toastify";
import {
    handleSelectedEvent,
    toggleEventFavouriteStatus,
} from "../../../redux/slice/eventSlice";
// import { toggleFavouriteStatus } from "../../../redux/slice/buyerSlice";
// import { toggleBidFavouriteStatus } from "../../../redux/slice/bidSlice";
import { useDispatch, useSelector } from "react-redux";
import { togglePropertyLike } from "../../../redux/action/sellerAction";
import { handleDeleteConfirmationModal } from "../../../redux/slice/modalSlice";
import moment from "moment";
import useTranslationHook from "../../hooks/useTranslationHook";
import { useNavigate } from "react-router-dom";
import { createSlug } from "../../../helpers";

const EventList = ({ events }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const selectedEvent = useSelector((state) => state.event.selectedEvent);
    const { t } = useTranslationHook();
    const navigate = useNavigate();
    let lang = useSelector((state) => state.translation.lang);

    const submitReaction = (id, isLiked = false) => {
        // dispatch(toggleFavouriteStatus(id || selectedEvent));
        // dispatch(toggleBidFavouriteStatus(id || selectedEvent));
        const formData = {
            domain: 3,
            property: id || selectedEvent,
            ...(user?.user_id && { user: Number(user.user_id) }),
        };
        dispatch(togglePropertyLike(formData));

        dispatch(
            toggleEventFavouriteStatus(
                events.map((ele) =>
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

    return (
        <div className="event-items-container">
            {events.length ? (
                events.map((event, index) => {
                    let imagePath;
                    if (
                        event.property_image?.image &&
                        event.property_image?.bucket_name
                    ) {
                        imagePath = `${process.env.REACT_APP_AZURE_BLOB_URL}${event.property_image.bucket_name}/${event.property_image.image}`;
                    } else {
                        imagePath = `${process.env.REACT_APP_AZURE_BLOB_URL}property_image/default_property.jpg`;
                    }
                    const now = new Date();
                    const startDate = new Date(event.start);
                    const endDate = new Date(event.end);
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                const fullPath =
                                    "/property/detail/" +
                                    createSlug(
                                        event.id,
                                        `${event.title}, ${event.country}`
                                    );
                                window.open(
                                    fullPath,
                                    "_blank",
                                    "noopener,noreferrer"
                                );
                            }}
                            className="event-item"
                            style={{
                                backgroundImage: `url("${imagePath}")`,
                                cursor: "pointer",
                            }}
                        >
                            <div className="time">
                                <img
                                    src="/img/calender-icon.svg"
                                    alt="calender"
                                />

                                {`${moment(event.start).format("MMM DD")}, ${moment(
                                    event.start
                                ).format("h:mmA")} - ${moment(event.end).format(
                                    "MMM DD"
                                )}, ${moment(event.end).format("h:mmA")}`}
                            </div>
                            {event?.status && (
                                <div
                                    className={`status ${
                                        now >= startDate &&
                                        now <= endDate &&
                                        event.status !== "Sold out"
                                            ? "active"
                                            : now < startDate
                                              ? "info"
                                              : "default"
                                    }`}
                                >
                                    {now >= startDate &&
                                    now <= endDate &&
                                    event.status !== "Sold out"
                                        ? "Active"
                                        : now < startDate
                                          ? "Upcoming"
                                          : "Closed"}
                                </div>
                            )}
                            <div className="event-heart">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (event.liked) {
                                            dispatch(
                                                handleDeleteConfirmationModal(
                                                    true
                                                )
                                            );
                                            dispatch(
                                                handleSelectedEvent(
                                                    Number(event.id)
                                                )
                                            );
                                        } else {
                                            submitReaction(
                                                Number(event.id),
                                                true
                                            );
                                        }
                                    }}
                                >
                                    <img
                                        src={
                                            event.liked
                                                ? "img/heart-icon-r.svg"
                                                : "img/heart-icon.svg"
                                        }
                                        alt={
                                            event.liked ? "Liked" : "Not Liked"
                                        }
                                    />
                                </button>
                            </div>
                            <div className="event-overlay">
                                <span className="event-title">
                                    {lang === "en"
                                        ? event.title
                                        : event.title_ar || ""}
                                </span>
                                <span className="event-price">
                                    {t("Amount", {
                                        amount: event.price,
                                    })}
                                </span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="no-events">{t("No auction added")}</div>
            )}
        </div>
    );
};

export default EventList;
