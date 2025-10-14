import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    saveAuction,
    setAuctionFormStep,
} from "../../../../redux/action/sellerAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { guessDateTime } from "../../../../utils/dateUtils";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import useTranslationHook from "../../../hooks/useTranslationHook";

const StepTwoForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslationHook();

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [reopenInfo, setReopenInfo] = useState(null);

    useEffect(() => {
        if (location.state) {
            const { is_reopen } = location.state || {};
            if (is_reopen) setReopenInfo({ is_reopen });
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const { id } = useParams();

    const stepOneData = useSelector(
        (state) => state.seller.property.auction.stepOneData
    );
    let lang = useSelector((state) => state.translation.lang);
    const propertyData = useSelector(
        (state) => state.seller.property.propertyData
    );
    const {
        state,
        community,
        country,
        listed_by: { first_name, last_name },
    } = propertyData || [];
    const onSubmitForm = (data) => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const combinedStartDateTime = `${stepOneData?.start_date}T${stepOneData?.start_time}:00`;
        const zonedStartDate = toZonedTime(combinedStartDateTime, timeZone);
        const combinedEndDateTime = `${stepOneData?.end_date}T${stepOneData?.end_time}:00`;
        const zonedEndDate = toZonedTime(combinedEndDateTime, timeZone);
        const formdata = {
            ...data,
            ...stepOneData,
            step: 2,
            property_id: id,
            is_featured: stepOneData.is_featured === "yes" ? 1 : 0,
            buyer_preference: Number(stepOneData.buyer_preference),
            sell_at_full_amount_status: stepOneData.sell_at_full_amount_status
                ? 1
                : 0,
            reservation_agreement_accepted: data.reservation_agreement_accepted
                ? 1
                : 0,
            end_date: format(zonedEndDate, "yyyy-MM-dd HH:mm:ssXXX", {
                timeZone,
            }),
            start_date: format(zonedStartDate, "yyyy-MM-dd HH:mm:ssXXX", {
                timeZone,
            }),
            ...(Object.keys(reopenInfo || {}).length && { ...reopenInfo }),
        };

        dispatch(saveAuction(formdata, navigate))
            .then(() => {
                if (reopenInfo) setReopenInfo(null);
            })
            .catch((error) => {});
    };
    return (
        <section className="property-wrap auction-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div className="col-lg-8">
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="counter">{t("2/2")}</div>
                            <h5 className="display-5 mb-3">
                                {t("Reservation Agreement")}
                            </h5>
                            <ul className="property-progress">
                                <li className="full" />
                                <li className="active" />
                            </ul>
                            <div className="row pt-5">
                                <div className="col-md-12">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="textLabel"
                                            className="form-label"
                                        >
                                            {t(
                                                "Please review and sign the reservation agreement to reserve your property for auction."
                                            )}
                                        </label>
                                        <div className="enable-text">
                                            {t(
                                                "Reservation Agreement Dynamic Value",
                                                {
                                                    first_name,
                                                    last_name,
                                                }
                                            )}
                                            <br />
                                            {t("Property Address")}:
                                            {` ${t(state)}, ${t(community)}, ${t(country)}`}
                                            <br />
                                            {t("Auction Date")}:
                                            {` ${guessDateTime(stepOneData?.start_date, "DD-MM-YYYY", 0, lang)} `}
                                            <br />
                                            {t("Terms of Reservation")}:
                                            <br />
                                            {t("First Terms Of Reservation")}
                                            <br />
                                            {t("Second Terms Of Reservation", {
                                                date: guessDateTime(
                                                    stepOneData?.start_date,
                                                    "DD-MM-YYYY",
                                                    0,
                                                    lang
                                                ),
                                            })}
                                            <br />
                                            {t("Third Terms Of Reservation")}
                                            <br />
                                            {t("Fourth Terms Of Reservation")}
                                            <br />
                                            {t("Fifth Terms Of Reservation")}
                                        </div>
                                    </div>
                                </div>
                                <div className="check mb-3">
                                    <input
                                        id="agree"
                                        type="checkbox"
                                        className="css-checkbox"
                                        {...register(
                                            "reservation_agreement_accepted",
                                            {
                                                required: t(
                                                    "You must agree to the terms before proceeding."
                                                ),
                                            }
                                        )}
                                    />
                                    <label
                                        htmlFor="agree"
                                        className="css-label"
                                    >
                                        {t(
                                            "I have read and agree to the terms of the reservation agreement."
                                        )}
                                    </label>
                                    {errors.reservation_agreement_accepted && (
                                        <p className="text-danger">
                                            {t(
                                                errors
                                                    ?.reservation_agreement_accepted
                                                    ?.message
                                            )}
                                        </p>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="signature"
                                            className="form-label"
                                        >
                                            {t("Signature")}
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={`${first_name || ""} ${last_name ? (last_name !== "NA" ? last_name : "") : ""}`.trim()}
                                            className="form-control"
                                            {...register(
                                                "reservation_agreement_sign",
                                                {
                                                    required: t(
                                                        "Signature is required"
                                                    ),
                                                }
                                            )}
                                            placeholder={t("Type your name")}
                                        />
                                        {errors.reservation_agreement_sign && (
                                            <p className="text-danger">
                                                {t(
                                                    errors
                                                        ?.reservation_agreement_sign
                                                        ?.message
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row pt-5">
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-sky btn-lg"
                                        onClick={() =>
                                            dispatch(setAuctionFormStep(1))
                                        }
                                    >
                                        <i className="fa-solid fa-angle-left mr4" />
                                        {t("Back")}
                                    </button>
                                </div>
                                <div className="col-md-6 right">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                    >
                                        {t("Submit")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StepTwoForm;
