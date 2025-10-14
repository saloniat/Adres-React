import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import DateSelector from "../../../home/common/DateSelector";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPropertyDetail,
    saveAuction,
    sellerAction,
    setAuctionFormStep,
} from "../../../../redux/action/sellerAction";
import { yupResolver } from "@hookform/resolvers/yup";
import { StepOneAuctionFormValidationSchema } from "../../../../utils/validations/sellerValidation";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import useTranslationHook from "../../../hooks/useTranslationHook";
import { handleEditOnAuction } from "../../../../redux/slice/sellerSlice";
import useDidMountEffect from "../../../hooks/useDidMountEffect";
import NumericInput from "../../../common/form/NumericInput";
import { fetchQuantaAPIData } from "../../../../redux/action/buyerAction";
import { formatNumber } from "../../../../helpers";
import moment from "moment";
const StepOneForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);

    const dispatch = useDispatch();
    const [state, setState] = useState(false);
    const stepOneData = useSelector(
        (state) => state.seller.property.auction.stepOneData
    );
    const [isAuctionRunning, setIsAuctionRunning] = useState(false);
    const isEdit = useSelector((state) => state.seller.property.auction.isEdit);
    const [estimatedValue, setEstimatedValue] = useState(0);
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty },
        setError,
        clearErrors,
    } = useForm({
        defaultValues: stepOneData,
        resolver: yupResolver(StepOneAuctionFormValidationSchema),
    });

    const startDate = useWatch({ control, name: "start_date" });

    const isToday = startDate && moment(startDate).isSame(moment(), "day");

    // If today, disable past times
    const minSelectableTime = isToday
        ? moment().toDate()
        : moment("00:00", "HH:mm").toDate();

    const endDate = useWatch({ control, name: "end_date" });
    const endTime = useWatch({ control, name: "end_time" });

    const prevStartDateRef = useRef(null);
    const prevEndDateRef = useRef(null);
    const prevEndTimeRef = useRef(null);

    const handleStartDateFocus = () => {
        // Save current state
        prevStartDateRef.current = startDate;
        prevEndDateRef.current = endDate;
        prevEndTimeRef.current = endTime;

        // Reset dependent fields
        setValue("end_date", "");
        setValue("end_time", "00:00");
    };

    const handleStartDateBlur = () => {
        const hasDateChanged =
            startDate &&
            moment(startDate).format("YYYY-MM-DD") !==
            moment(prevStartDateRef.current).format("YYYY-MM-DD");

        if (hasDateChanged) {
            // Reset end values
            setValue("end_date", "");
            setValue("end_time", "00:00");
        } else {
            // Restore previous values
            if (prevEndDateRef.current) {
                setValue("end_date", prevEndDateRef.current);
            }
            if (prevEndTimeRef.current) {
                setValue("end_time", prevEndTimeRef.current);
            }
        }

        // Update stored start date
        prevStartDateRef.current = startDate;
    };

    useEffect(() => {
        try {
            dispatch(fetchQuantaAPIData("comparable-price")).then(
                (response) => {
                    const content = response?.content;
                    const projectPrices = content
                        ?.map((item) => item?.averagePriceProject)
                        ?.filter(
                            (price) => price !== null && price !== undefined
                        );

                    const districtPrices = content
                        ?.map((item) => item?.averagePriceDistrict)
                        ?.filter(
                            (price) => price !== null && price !== undefined
                        );

                    let averagePrice;

                    if (projectPrices?.length > 0) {
                        averagePrice =
                            projectPrices?.reduce(
                                (acc, curr) => acc + curr,
                                0
                            ) / projectPrices?.length;
                    } else if (districtPrices?.length > 0) {
                        averagePrice =
                            districtPrices?.reduce(
                                (acc, curr) => acc + curr,
                                0
                            ) / districtPrices?.length;
                    } else {
                        averagePrice = 0;
                    }
                    if (averagePrice) {
                        setEstimatedValue(averagePrice);
                    }
                }
            );
        } catch (error) {
            console.error("One of the requests failed:", error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        id &&
            !isEdit &&
            dispatch(fetchPropertyDetail(id)).then(() => {
                // const { property_auction_data } = data || {};
                // if (property_auction_data?.length) setState(true);
            });
        //eslint-disable-next-line
    }, [id, isEdit]);

    useEffect(() => {
        reset({
            ...stepOneData,
            start_date: moment(
                stepOneData.start_date,
                "YYYY-MM-DD",
                true
            ).isValid()
                ? moment(stepOneData.start_date, "YYYY-MM-DD").toDate()
                : null,

            end_date: moment(stepOneData.end_date, "YYYY-MM-DD", true).isValid()
                ? moment(stepOneData.end_date, "YYYY-MM-DD").toDate()
                : null,
        });
    }, [reset, stepOneData]);
    useDidMountEffect(() => {
        dispatch(handleEditOnAuction(true));
    }, [isDirty]);

    const handleNext = (data) => {
        data.start_date = format(data.start_date, "yyyy-MM-dd");
        data.end_date = format(data.end_date, "yyyy-MM-dd");
        dispatch(sellerAction.handleAuctionStepOneData(data));
        if (!state) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            dispatch(setAuctionFormStep(2));
        }
        if (state) {
            const formdata = {
                ...data,
                step: 2,
                property_id: id,
                auction_status: 1,
                reservation_agreement_accepted: true,
                reservation_agreement_sign: "ABCDER",
                is_featured: data.is_featured === "yes" ? 1 : 0,
                buyer_preference: Number(data.buyer_preference),
                sell_at_full_amount_status: data.sell_at_full_amount_status
                    ? 1
                    : 0,
            };
            dispatch(saveAuction(formdata)).then(({ error, code }) => {
                if (error === 0 && code === 1) navigate("/my-properties");
            });
        }
    };

    useEffect(() => {
        const checkAuctionRunning = () => {
            const now = moment();
            const start = moment(
                `${stepOneData.start_date} ${stepOneData.start_time}`,
                "YYYY-MM-DD HH:mm"
            );
            const end = moment(
                `${stepOneData.end_date} ${stepOneData.end_time}`,
                "YYYY-MM-DD HH:mm"
            );

            return now.isBetween(start, end);
        };

        // Initial check
        setIsAuctionRunning(checkAuctionRunning());
    }, [stepOneData]);

    return (
        <section className="property-wrap auction-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div className="col-lg-8">
                        <div className="counter">{t("1/2")}</div>
                        <h5 className="display-5 mb-3">
                            {t("Auction Details")}
                        </h5>
                        <ul className="property-progress">
                            <li className="active" />
                            <li />
                        </ul>
                        {estimatedValue > 0 && (
                            <div className="alert alert-primary mt-4 mb-0">
                                <img
                                    src="/img/info-icon.svg"
                                    alt="info"
                                    className="ml4"
                                />
                                {t(
                                    "The estimated market value for this property is"
                                )}{" "}
                                {formatNumber(estimatedValue, lang)}.
                            </div>
                        )}
                        <form onSubmit={handleSubmit(handleNext)}>
                            <div className="row pt-5">
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <label
                                            className="form-label"
                                            htmlFor="min_starting_price"
                                        >
                                            {t("Min Starting Price")}
                                        </label>
                                        <div className="aedPrefix">
                                            <span>{t("AED Label")}</span>
                                            <NumericInput
                                                register={register}
                                                placeholder="Enter starting price"
                                                name="start_price"
                                                readOnly={isAuctionRunning}
                                            />
                                        </div>
                                        {errors.start_price && (
                                            <p className="text-danger">
                                                {t(errors.start_price?.message)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="deposit price"
                                            className="form-label"
                                        >
                                            {t("Deposit Price")}
                                        </label>
                                        <div className="aedPrefix">
                                            <span>{t("AED Label")}</span>
                                            <NumericInput
                                                register={register}
                                                placeholder="Enter deposit price"
                                                name="deposit_amount"
                                                readOnly={isAuctionRunning}
                                            />
                                        </div>
                                        {errors.deposit_amount && (
                                            <p className="text-danger">
                                                {t(
                                                    errors.deposit_amount
                                                        ?.message
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="reseved price"
                                            className="form-label"
                                        >
                                            {t("Reserved Price")}
                                        </label>
                                        <div className="aedPrefix">
                                            <span>{t("AED Label")}</span>
                                            <NumericInput
                                                register={register}
                                                placeholder="Enter reserved price"
                                                name="reserve_amount"
                                            />
                                        </div>
                                        {errors.reserve_amount && (
                                            <p className="text-danger">
                                                {t(
                                                    errors.reserve_amount
                                                        ?.message
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="byeprefence">
                                <label
                                    htmlFor="Buyer Preference"
                                    className="form-label"
                                >
                                    {t("Buyer Preference")}
                                </label>
                                <div className="radioList">
                                    <div className="form-check">
                                        <input
                                            {...register("buyer_preference")}
                                            type="radio"
                                            value="1"
                                            id="flexRadioDefault1"
                                            className="css-radio"
                                            disabled={isAuctionRunning}
                                        />

                                        <label
                                            className="css-labell"
                                            htmlFor="flexRadioDefault1"
                                        >
                                            {t("Cash")}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            {...register("buyer_preference")}
                                            type="radio"
                                            value="2"
                                            id="flexRadioDefault2"
                                            className="css-radio"
                                            disabled={isAuctionRunning}
                                        />
                                        <label
                                            className="css-labell"
                                            htmlFor="flexRadioDefault2"
                                        >
                                            {t("Mortgage")}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            {...register("buyer_preference")}
                                            type="radio"
                                            value="3"
                                            id="flexRadioDefault3"
                                            className="css-radio"
                                            disabled={isAuctionRunning}
                                        />
                                        <label
                                            className="css-labell"
                                            htmlFor="flexRadioDefault3"
                                        >
                                            {t("Both")}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="row pt-3">
                                <div className="full-price">
                                    <label
                                        htmlFor="Sell at full price"
                                        className="form-label"
                                    >
                                        {t("Sell at full price")}
                                    </label>
                                    <div className="form-check form-switch">
                                        <input
                                            disabled={isAuctionRunning}
                                            type="checkbox"
                                            className="form-check-input"
                                            {...register(
                                                "sell_at_full_amount_status",
                                                {
                                                    onChange: (e) => {
                                                        if (!e.target.checked)
                                                            setValue(
                                                                "full_amount",
                                                                null
                                                            );
                                                    },
                                                }
                                            )}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="flexSwitchCheckChecked"
                                        >
                                            {""}
                                        </label>
                                    </div>
                                </div>
                                <p className="enable-text mb-0">
                                    {t(
                                        "Enable this option to sell the property immediately at your desired full price without waiting for further bids."
                                    )}
                                </p>
                                {watch("sell_at_full_amount_status") && (
                                    <div className="col-md-6 pt-3">
                                        <label
                                            htmlFor="Full price"
                                            className="form-label"
                                        >
                                            {t("Full price")}
                                        </label>
                                        <div className="aedPrefix">
                                            <span>{t("AED Label")}</span>
                                            <NumericInput
                                                register={register}
                                                placeholder="Enter full price"
                                                name="full_amount"
                                                readOnly={isAuctionRunning}
                                            />
                                        </div>
                                        {errors.full_amount && (
                                            <p className="text-danger">
                                                {t(errors.full_amount?.message)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <hr />

                            <div className="row pt-3">
                                {/* <div className="full-price">
                                    <label
                                        htmlFor="Bid Increament"
                                        className="form-label"
                                    >
                                        {t("Bid Increment")}
                                    </label>
                                    <div className="form-check form-switch">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            disabled={true}
                                            {...register(
                                                "bid_increment_status",
                                                {
                                                    onChange: (e) => {
                                                        if (!e.target.checked)
                                                            setValue(
                                                                "bid_increments",
                                                                null
                                                            );
                                                    },
                                                }
                                            )}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="flexSwitchCheckChecked"
                                        >
                                            {""}
                                        </label>
                                    </div>
                                </div> */}
                                {/* {errors.bid_increment_status && (
                                    <p className="text-danger">
                                        {t(
                                            errors.bid_increment_status?.message
                                        )}
                                    </p>
                                )} */}
                                {/* <p className="enable-text mb-0">
                                    {t("Bid content")}
                                </p> */}
                                {/* {watch("bid_increment_status") && ( */}
                                <div className="col-md-6 pt-3">
                                    <label
                                        htmlFor="Bid price"
                                        className="form-label"
                                    >
                                        {t("Bid Increment Price")}
                                    </label>
                                    <div className="aedPrefix">
                                        <span>{t("AED Label")}</span>
                                        <NumericInput
                                            register={register}
                                            placeholder={t(
                                                "Enter bid increment price"
                                            )}
                                            name="bid_increments"
                                            readOnly={isAuctionRunning}
                                        />
                                    </div>
                                    {errors.bid_increments && (
                                        <p className="text-danger">
                                            {t(
                                                errors.bid_increments
                                                    ?.message
                                            )}
                                        </p>
                                    )}
                                </div>
                                {/* )} */}
                            </div>
                            <hr />

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="Starting Date &amp; Time"
                                            className="form-label"
                                        >
                                            {/* Starting Date &amp; Time */}
                                            {t("Starting Date & Time")}
                                        </label>
                                        <div className="date">
                                            <DateSelector
                                                control={control}
                                                name="start_date"
                                                disabled={isAuctionRunning}
                                                handleChange={() => {
                                                    setValue(
                                                        "end_time",
                                                        "00:00"
                                                    );
                                                    setValue(
                                                        "start_time",
                                                        "00:00"
                                                    );
                                                    setValue("end_date", "");
                                                    clearErrors("end_time");
                                                    clearErrors("start_time");
                                                }}
                                                className="form-control"
                                                placeholderText={t("Date")}
                                                dateFormat="yyyy-MM-dd"
                                                showYearDropdown
                                                scrollableMonthYearDropdown
                                                minDate={new Date()}
                                                maxDate={endDate || ""}
                                                onFocus={handleStartDateFocus}
                                                onBlur={handleStartDateBlur}
                                            />

                                            {errors.start_date && (
                                                <p className="text-danger">
                                                    {t(
                                                        errors.start_date
                                                            ?.message
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="starting_time"
                                            className="form-label"
                                        >
                                            &nbsp;{""}
                                        </label>
                                        <div className="time">
                                            <DateSelector
                                                disabled={isAuctionRunning}
                                                control={control}
                                                name="start_time"
                                                className="form-control"
                                                placeholderText={t("Time")}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                timeFormat="HH:mm"
                                                dateFormat="HH:mm"
                                                minTime={minSelectableTime} // 👈 this disables past time
                                                maxTime={moment(
                                                    "23:45",
                                                    "HH:mm"
                                                ).toDate()}
                                            />
                                            {errors.start_time && (
                                                <p className="text-danger">
                                                    {t(
                                                        errors.start_time
                                                            ?.message
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label
                                        htmlFor="Ending Date &amp; Time"
                                        className="form-label"
                                    >
                                        {/* Ending Date &amp; Time */}
                                        {t("Ending Date & Time")}
                                    </label>
                                    <div className="date">
                                        <DateSelector
                                            control={control}
                                            key={new Date()}
                                            name="end_date"
                                            handleChange={() => {
                                                setValue("end_time", "00:00");
                                                clearErrors("end_time");
                                            }}
                                            className="form-control"
                                            placeholderText={t("Date")}
                                            dateFormat="yyyy-MM-dd"
                                            showYearDropdown
                                            disabled={!startDate ? true : false}
                                            scrollableMonthYearDropdown
                                            minDate={startDate}
                                        />
                                        {errors.end_date && (
                                            <p className="text-danger">
                                                {t(errors.end_date?.message)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor=" " className="form-label">
                                        &nbsp;{""}
                                    </label>
                                    <div className="time">
                                        <DateSelector
                                            control={control}
                                            name="end_time"
                                            className="form-control"
                                            placeholderText={t("Time")}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            timeFormat="HH:mm"
                                            disabled={!startDate ? true : false}
                                            dateFormat="HH:mm"
                                        />
                                        {errors.end_time && (
                                            <p className="text-danger">
                                                {t(errors.end_time?.message)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="checkbox-wrap">
                                    <label
                                        htmlFor="Would you like to feature your property?"
                                        className="form-label"
                                    >
                                        {t(
                                            "Would you like to feature your property?"
                                        )}
                                    </label>
                                    <div className="radioList">
                                        <div className="form-check">
                                            <input
                                                disabled={isAuctionRunning}
                                                {...register("is_featured")}
                                                type="radio"
                                                value="yes"
                                                id="feature1"
                                                className="css-radio"
                                            />
                                            <label
                                                className="css-labell"
                                                htmlFor="feature1"
                                            >
                                                {t("Yes")}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                disabled={isAuctionRunning}
                                                {...register("is_featured")}
                                                type="radio"
                                                value="no"
                                                id="feature2"
                                                className="css-radio"
                                            />
                                            <label
                                                className="css-labell"
                                                htmlFor="feature2"
                                            >
                                                {t("No")}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                >
                                    {state ? t("Update") : t("Next")}
                                    {!state && (
                                        <i className="fa-solid fa-angle-right ml4" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StepOneForm;
