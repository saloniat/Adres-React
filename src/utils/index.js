import axios from "axios";
import { toast } from "react-toastify";
import { categorizeNotification } from "./dateUtils";
import moment from "moment";
import "moment/locale/ar"; // Import Arabic locale
export const errorHandler = (error) => {
    const { request, response } = error;
    if (response) {
        const { message } = response.data;
        const status = response.status;
        return { msg: message, status };
    } else if (request) {
        if (axios.isCancel(error)) {
            return { msg: error.message, status: error.status };
        }
        return { msg: "server time out", status: 503 };
    } else {
        return { msg: "opps! something went wrong while setting up request" };
    }
};

export const config = { headers: { "Content-Type": "application/json" } };
export const configMultipart = {
    headers: { "Content-Type": "multipart/form-data" },
};

export const errToast = (err) => {
    if (!err || sessionStorage.getItem("inactiveUser")) return;
    toast.error(
        sessionStorage.getItem("i18nextLng") === "en"
            ? "Error processing request. Please try again or contact our technical support team."
            : "حدث خطأ أثناء معالجة الطلب. يُرجى المحاولة مجددًا أو التواصل مع فريق الدعم الفني.",
        {
            toastId: "Error Processing Request.",
        }
    );
};

export const sleep = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

export const generateLabel = (dateStr) => {
    const now = moment.utc();

    const date = moment.utc(dateStr);

    if (now.isSame(date, "day")) return "Today";
    if (now.clone().subtract(1, "day").isSame(date, "day")) return "Yesterday";

    const diffYears = now.diff(date, "years");
    if (diffYears >= 1)
        return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;

    const diffMonths = now.diff(date, "months");
    if (diffMonths >= 1)
        return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;

    const diffWeeks = now.diff(date, "weeks");
    if (diffWeeks >= 1)
        return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;

    const diffDays = now.diff(date, "days");
    if (diffDays >= 1) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.fromNow(); // fallback like "a few seconds ago"
};

export const groupNotificationByDate = (
    notifications,
    date_key = "added_on"
) => {
    return notifications.reduce((acc, notification) => {
        const label = generateLabel(notification[date_key]);
        if (!acc[label]) acc[label] = [];
        acc[label].push(notification);
        return acc;
    }, {});
};

export const removeQueryParam = (param) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);

    let newUrl = url.origin + url.pathname;
    if (newUrl.endsWith("/") && newUrl !== url.origin) {
        newUrl = newUrl.slice(0, -1);
    }
    window.history.replaceState({}, "", newUrl);
};

export const formatChatTime = (date, userList, locale = "en") => {
    moment.locale(locale); // Set the locale

    const now = moment();
    const messageDate = moment(date);

    const timeFormat = "h:mm A";
    const userListDateFormat = `DD MMM YYYY`;
    const chatDateTimeFormat = `DD MMM YYYY, ${timeFormat}`;
    const dayTimeFormat = `dddd, ${timeFormat}`;

    const translatedYesterday = locale === "ar" ? "أمس" : "Yesterday";

    if (now.isSame(messageDate, "day")) {
        return messageDate.format(timeFormat);
    } else if (now.clone().subtract(1, "days").isSame(messageDate, "day")) {
        return `${translatedYesterday}${userList ? "" : `, ${messageDate.format(timeFormat)}`}`;
    } else if (now.isSame(messageDate, "week")) {
        return messageDate.format(dayTimeFormat);
    } else {
        return messageDate.format(
            userList ? userListDateFormat : chatDateTimeFormat
        );
    }
};

export const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start on Sunday
    return Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return {
            date: day.toISOString().split("T")[0], // Format: YYYY-MM-DD
            weekday: day.toLocaleDateString("en-US", { weekday: "short" }), // "SUN"
            day: day.getDate(), // 23, 24, etc.
            month: day.toLocaleString("en-US", { month: "short" }), // "Mar"
            year: day.getFullYear(),
        };
    });
};

// export const groupEventsByDate = (events) => {
//     const groupedEvents = events.reduce((acc, event) => {
//         const localDate = moment.utc(event.start).local().format("YYYY-MM-DD");
//         if (!acc[localDate]) acc[localDate] = [];
//         acc[localDate].push(event);
//         return acc;
//     }, {});

//     Object.keys(groupedEvents).forEach((date) => {
//         groupedEvents[date].sort(
//             (a, b) => new Date(a.start) - new Date(b.start)
//         );
//     });

//     return groupedEvents;
// };

// export const groupEventsByDate = (events, startDateStr, endDateStr) => {
//     const startDate = new Date(startDateStr);
//     const endDate = new Date(endDateStr);
//     const result = {};
//     for (
//         let d = new Date(startDate);
//         d <= endDate;
//         d.setDate(d.getDate() + 1)
//     ) {
//         const dateString = d.toISOString().split("T")[0];
//         const filteredEvents = events.filter(
//             (event) => new Date(event.end) >= d
//         );
//         // Sort events by start date ascending
//         filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
//         result[dateString] = filteredEvents;
//     }
//     console.info(result)
//     return result;
// };

export const groupEventsByDate = (events, startDateStr, endDateStr) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const result = {};
    const normalizeDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };
    for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
    ) {
        const currentDate = normalizeDate(d);
        const dateString = currentDate.toLocaleDateString("en-CA"); // Local date in YYYY-MM-DD
        const filteredEvents = events.filter((event) => {
            const eventStart = normalizeDate(new Date(event.start));
            const eventEnd = normalizeDate(new Date(event.end));
            return eventStart <= currentDate && eventEnd >= currentDate;
        });
        filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
        result[dateString] = filteredEvents;
    }
    return result;

};

