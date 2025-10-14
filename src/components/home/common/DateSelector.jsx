import React from "react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { format } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import { useSelector } from "react-redux";

const DateSelector = ({ name, control, handleChange, ...rest }) => {
    const getLocaleObject = (localeCode) => {
        const map = {
            en: enUS,
            ar: arSA,
        };
        return map[localeCode] || enUS; // fallback to enUS
    };
    const lang = useSelector((state) => state.translation.lang);
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <div dir={lang === "ar" ? "rtl" : "ltr"}>
                    <DatePicker
                        locale={getLocaleObject(lang)}
                        selected={
                            rest.showTimeSelect && rest.showTimeSelectOnly
                                ? value
                                    ? moment(value, "HH:mm").isValid()
                                        ? moment(value, "HH:mm").toDate()
                                        : null
                                    : null
                                : value
                                  ? value instanceof Date
                                      ? value
                                      : new Date(value)
                                  : null
                        }
                        // onKeyDown={(e) => e.preventDefault()}
                        onChange={(date) => {
                            if (
                                rest.showTimeSelect &&
                                rest.showTimeSelectOnly
                            ) {
                                if (date instanceof Date && !isNaN(date)) {
                                    const formattedTime = format(date, "HH:mm");
                                    onChange(formattedTime);
                                } else {
                                    onChange(null);
                                }
                            } else {
                                onChange(date);
                            }
                            if (handleChange) handleChange(date);
                        }}
                        {...rest}
                    />
                </div>
            )}
        />
    );
};

export default DateSelector;
