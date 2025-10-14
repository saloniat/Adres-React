import moment from "moment";

export const configureMoment = (lang) => {
    const locale = lang === "ar" ? "ar" : "en";
    moment.locale(locale);
};
