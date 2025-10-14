import moment from "moment";
import React, { Fragment } from "react";
import useTranslationHook from "../hooks/useTranslationHook";
import { useDispatch, useSelector } from "react-redux";
import { generateLabel } from "../../utils";
import {
    // addHtmlOnClickIfSellerHref,
    addHtmlOnClickToAllAnchors,
    removeDomain,
    toEasternArabicNumerals,
} from "../../helpers";
import { handleToggleModal } from "../../redux/slice/modalSlice";
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notiList = {} }) => {
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);
    const account = useSelector((state) => state.profile.account);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const translateRelativeTime = (label) => {
        const match = label.match(/^(\d+)\s(\w+)\sago$/);
        if (!match) return t(label); // fallback for "Today", "Yesterday", etc.

        const [, countStr, unit] = match;
        const count = parseInt(countStr, 10);
        const easternCount = toEasternArabicNumerals(count, lang);

        const translationKey = `${unit} ago`; // e.g., 'days ago'
        return t(translationKey, { count: easternCount });
    };

    if (!Object.keys(notiList || {}).length)
        return <>{t("No Notification Found")}</>;

    // Sort categories (keys) in descending order based on the latest notification date inside each
    const sortedCategories = Object.keys(notiList).sort((a, b) => {
        const dateA = moment.utc(notiList[a][0]?.added_on);
        const dateB = moment.utc(notiList[b][0]?.added_on);
        return dateB.diff(dateA);
    });

    return (
        <Fragment>
            {sortedCategories.map((category) => {
                if (!notiList[category]) return null;
                return (
                    <div key={category}>
                        <div className="noti-title">
                            {translateRelativeTime(category)}
                        </div>
                        <ul className="notification-list">
                            {notiList[category].map((notification) => (
                                <li
                                    key={notification.id}
                                    {...(!notification.is_read && {
                                        className: "active",
                                    })}
                                >
                                    <span
                                        className="note"
                                        onClick={() => {
                                            let url =
                                                removeDomain(
                                                    notification?.redirect_url
                                                ) || "";
                                            dispatch(
                                                handleToggleModal({
                                                    commonModal: false,
                                                })
                                            );
                                            navigate(url);
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                lang === "en"
                                                    ? addHtmlOnClickToAllAnchors(
                                                          notification.content
                                                      )
                                                    : addHtmlOnClickToAllAnchors(
                                                          notification.content_ar
                                                      ),
                                        }}
                                    />
                                    <div className="duration">
                                        {translateRelativeTime(
                                            generateLabel(notification.added_on)
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </Fragment>
    );
};

export default NotificationItem;
