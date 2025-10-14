import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ar"; // Arabic locale
import "dayjs/locale/en"; // English locale
import customParseFormat from "dayjs/plugin/customParseFormat";
import { toEasternArabicNumerals } from "../helpers";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export function guessDateTime(datetime, format, daysToAdd = 0, locale = "en") {
    const guessedTimezone = guessTimezone();

    let dateToFormat;

    if (datetime) {
        const parsed =
            typeof datetime === "string"
                ? dayjs(
                      datetime,
                      ["DD-MM-YYYY", "MM-DD-YYYY", dayjs.ISO_8601],
                      true
                  )
                : dayjs(datetime);

        if (!parsed.isValid()) {
            console.warn("Invalid date input:", datetime);
            return "";
        }

        dateToFormat = parsed.tz(guessedTimezone).add(daysToAdd, "day");
    } else {
        dateToFormat = dayjs().tz(guessedTimezone).add(daysToAdd, "day");
    }

    const formatted = dateToFormat.locale(locale).format(format);

    return locale === "ar"
        ? toEasternArabicNumerals(
              formatted,
              sessionStorage.getItem("i18nextLng")
          )
        : formatted;
}

export function guessTimezone() {
    return dayjs.tz.guess();
}

export const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
