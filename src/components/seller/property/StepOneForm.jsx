import React, { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatEID, handleKeyDown } from "../../../helpers";
import DateSelector from "../../home/common/DateSelector";
import {
    setFormStep,
    saveStepOneData,
    setCountries,
    fetchListingStatus,
} from "../../../redux/action/sellerAction";
import { StepOneFormValidationSchema } from "../../../utils/validations/sellerValidation";
import { guessDateTime } from "../../../utils/dateUtils";
import useTranslationHook from "../../hooks/useTranslationHook";
import ReactSelect from "../../common/ReactSelect";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Tooltip from "rc-tooltip";


const StepOneForm = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    const countries = useSelector((state) => state.seller.countries);
    const auctionStatus = useSelector((state) => state.seller.auctionStatus);
    const savedData = useSelector((state) => state.seller.property.stepOneData);
    const today = new Date();
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
    const onSubmit = ({ owners }) => {
        const totalShare = sharePercentages?.reduce(
            (acc, owner) => acc + (parseFloat(owner.sharePercentage) || 0),
            0
        );

        if (Number(totalShare) !== 100) {
            setError("owners", {
                sharePercentage: {
                    message: "Total share percentage must be exactly 100%",
                },
            });
            return;
        } else {
            clearErrors("owners");
        }

        dispatch(
            saveStepOneData(
                owners.map((owner) => {
                    if (owner?.dob instanceof Date && !isNaN(owner.dob)) {
                        return {
                            ...owner,
                            dob: guessDateTime(owner.dob, "YYYY-MM-DD"),
                            // phone,
                        };
                    }
                    return { ...owner };
                })
            )
        );
        dispatch(setFormStep(2));
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    const {
        register,
        handleSubmit,
        setValue,
        control,
        setError,
        clearErrors,
        formState: { errors },
        watch,
    } = useForm({
        resolver: yupResolver(StepOneFormValidationSchema()),
        defaultValues: { owners: savedData },
        mode: "all",
    });

    const sharePercentages = watch("owners");
    const { fields, append, remove } = useFieldArray({
        control,
        name: "owners",
    });

    useLayoutEffect(() => {
        if (!countries || countries?.length === 0) dispatch(setCountries());
    }, []);

    useLayoutEffect(() => {
        if (!auctionStatus || auctionStatus?.length === 0)
            dispatch(fetchListingStatus());
    }, []);

    return (
        <section className="property-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div className="col-lg-8">
                        <div className="counter">{t("1/4")}</div>
                        <h5 className="display-5 mb-3">
                            {t("Ownership Info")}
                        </h5>
                        <ul className="property-progress">
                            <li className="active"></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            autoComplete="off"
                            autoCapitalize="off"
                        >
                            <div className="prop-bdr">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="row mb-4 position-relative"
                                    >
                                        {/* <div className="shtbdr">&nbsp;</div> */}

                                        <div className="col-md-12">
                                            <h6 className="pb-3">
                                                {t("Owner Number", {
                                                    index: index + 1,
                                                })}
                                            </h6>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label
                                                    htmlFor={`owners.${index}.ownerName`}
                                                    className="form-label"
                                                >
                                                    {t("Name Label")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors?.owners?.[index]?.ownerName ? "is-invalid" : ""}`}
                                                    placeholder={t(
                                                        "Enter full name"
                                                    )}
                                                    {...register(
                                                        `owners.${index}.ownerName`
                                                    )}
                                                />
                                                {errors?.owners?.[index]
                                                    ?.ownerName && (
                                                    <div className="invalid-feedback">
                                                        {t(
                                                            errors.owners[index]
                                                                .ownerName
                                                                .message
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label
                                                    htmlFor={`owners.${index}.nationality`}
                                                    className="form-label"
                                                >
                                                    {t("Nationality")}
                                                </label>
                                                <ReactSelect
                                                    name={`owners.${index}.nationality`}
                                                    control={control}
                                                    options={countries}
                                                    isSearchable
                                                    placeholder={t(
                                                        "Enter nationality"
                                                    )}
                                                    className="select"
                                                />
                                                {errors?.owners?.[index]
                                                    ?.nationality ? (
                                                    <div className="invalid-feedback">
                                                        {t(
                                                            errors.owners[index]
                                                                .nationality
                                                                .message
                                                        )}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                        {/* <div className="col-md-6">
                                            <div className="mb-4">
                                                <label
                                                    htmlFor={`owners.${index}.nationality`}
                                                    className="form-label"
                                                >
                                                    {t("Nationality")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors?.owners?.[index]?.nationality ? "is-invalid" : ""}`}
                                                    placeholder={t(
                                                        "Enter nationality"
                                                    )}
                                                    {...register(
                                                        `owners.${index}.nationality`
                                                    )}
                                                />
                                                {errors?.owners?.[index]
                                                    ?.nationality ? (
                                                    <div className="invalid-feedback">
                                                        {t(
                                                            errors.owners[index]
                                                                .nationality
                                                                .message
                                                        )}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div> */}
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label
                                                    htmlFor={`owners.${index}.dob`}
                                                    className="form-label"
                                                >
                                                    {t("Date of Birth")}
                                                </label>
                                                <DateSelector
                                                    control={control}
                                                    name={`owners.${index}.dob`}
                                                    className="form-control"
                                                    placeholderText={t(
                                                        "YYYY-MM-DD"
                                                    )}
                                                    dateFormat="yyyy-MM-dd"
                                                    showYearDropdown
                                                    scrollableMonthYearDropdown
                                                    openToDate={
                                                        eighteenYearsAgo
                                                    }
                                                    maxDate={eighteenYearsAgo}
                                                />
                                                {errors?.owners?.[index]
                                                    ?.dob && (
                                                    <div
                                                        style={{
                                                            display: "block",
                                                        }}
                                                        className="invalid-feedback"
                                                    >
                                                        {t(
                                                            errors.owners[index]
                                                                .dob.message
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label className="form-label">
                                                    {t("Phone Number")}{" "}
                                                    <Tooltip
                                                        overlay={
                                                            <span>
                                                                No need to
                                                                include the
                                                                country code
                                                                (e.g., +971 for
                                                                UAE)
                                                            </span>
                                                        }
                                                        placement="top"
                                                    >
                                                        <span
                                                            className="ms-2 text-info"
                                                            data-tooltip-id={`my-tooltip-${index}`}
                                                        >
                                                            <i className="fas fa-info-circle"></i>
                                                        </span>
                                                    </Tooltip>
                                                </label>

                                                <Controller
                                                    name={`owners.${index}.phone`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <PhoneInput
                                                            {...field}
                                                            country={"ae"}
                                                            onlyCountries={[
                                                                "ae",
                                                            ]}
                                                            countryCodeEditable={
                                                                false
                                                            }
                                                            inputClass={`form-control ${errors?.owners?.[index]?.phone ? "is-invalid" : ""}`}
                                                            inputStyle={{
                                                                width: "100%",
                                                            }}
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                field.onChange(
                                                                    value
                                                                );
                                                            }}
                                                            inputProps={{
                                                                ref: field.ref, // <-- IMPORTANT: attach RHF ref
                                                            }}
                                                        />
                                                    )}
                                                />

                                                {errors?.owners?.[index]
                                                    ?.phone ? (
                                                    <div className="invalid-feedback show">
                                                        {t(
                                                            errors.owners[index]
                                                                .phone.message
                                                        )}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label
                                                    htmlFor={`owners.${index}.email`}
                                                    className="form-label"
                                                >
                                                    {t("Email ID")}
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${errors?.owners?.[index]?.email ? "is-invalid" : ""}`}
                                                    placeholder={t(
                                                        "Enter email id"
                                                    )}
                                                    {...register(
                                                        `owners.${index}.email`
                                                    )}
                                                />
                                                {errors?.owners?.[index]
                                                    ?.email && (
                                                    <div className="invalid-feedback">
                                                        {t(
                                                            errors.owners[index]
                                                                .email.message
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label
                                                    htmlFor={`owners.${index}.sharePercentage`}
                                                    className="form-label"
                                                >
                                                    {t("Property Share")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors?.owners?.[index]?.sharePercentage ? "is-invalid" : ""}`}
                                                    placeholder={t(
                                                        "Enter property share"
                                                    )}
                                                    {...register(
                                                        `owners.${index}.sharePercentage`
                                                    )}
                                                    onInput={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        if (
                                                            !/^\d*\.?\d{0,2}$/.test(
                                                                value
                                                            )
                                                        ) {
                                                            e.target.value =
                                                                value.slice(
                                                                    0,
                                                                    -1
                                                                );
                                                        }
                                                        if (
                                                            parseFloat(value) >
                                                            100
                                                        ) {
                                                            e.target.value =
                                                                "100";
                                                        }
                                                    }}
                                                />
                                                {errors?.owners?.[index]
                                                    ?.sharePercentage && (
                                                    <div className="invalid-feedback">
                                                        {t(
                                                            errors.owners[index]
                                                                .sharePercentage
                                                                .message
                                                        )}
                                                    </div>
                                                )}

                                                {errors?.owners
                                                    ?.sharePercentage && (
                                                    <div
                                                        className="invalid-feedback"
                                                        style={{
                                                            display: "block",
                                                        }}
                                                    >
                                                        {t(
                                                            errors?.owners
                                                                ?.sharePercentage
                                                                ?.message
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <div className="eid-type">
                                                    <label
                                                        htmlFor={`owners.${index}.passport`}
                                                        className="form-label"
                                                    >
                                                        {watch(
                                                            `owners.${index}.useEID`
                                                        ) === "true"
                                                            ? t("EID")
                                                            : t("Passport")}
                                                    </label>
                                                    <div className="vacancy-type">
                                                        <div className="check">
                                                            <input
                                                                type="radio"
                                                                className="css-radio"
                                                                id={`eidradio-${index}`}
                                                                value="true"
                                                                {...register(
                                                                    `owners.${index}.useEID`
                                                                )}
                                                            />
                                                            <label
                                                                htmlFor={`eidradio-${index}`}
                                                                className="css-labell"
                                                            >
                                                                {t("EID Label")}
                                                            </label>
                                                        </div>
                                                        <div className="check">
                                                            <input
                                                                type="radio"
                                                                className="css-radio"
                                                                id={`passportradio-${index}`}
                                                                value="false"
                                                                {...register(
                                                                    `owners.${index}.useEID`
                                                                )}
                                                            />
                                                            <label
                                                                htmlFor={`passportradio-${index}`}
                                                                className="css-labell"
                                                            >
                                                                {t("Passport")}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                {watch(
                                                    `owners.${index}.useEID`
                                                ) === "true" && (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors?.owners?.[index]?.eid ? "is-invalid" : ""}`}
                                                            placeholder={t(
                                                                "Enter your EID Number"
                                                            )}
                                                            maxLength={17}
                                                            value={formatEID(watch(
                                                                `owners.${index}.eid`
                                                            ))}
                                                            onChange={(e) => {
                                                                const formattedEID =
                                                                    formatEID(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                setValue(
                                                                    `owners.${index}.eid`,
                                                                    formattedEID,
                                                                    {
                                                                        shouldValidate: true,
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                        {errors?.owners?.[index]
                                                            ?.eid && (
                                                            <div className="invalid-feedback">
                                                                {t(
                                                                    errors
                                                                        .owners[
                                                                        index
                                                                    ].eid
                                                                        .message
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {watch(
                                                    `owners.${index}.useEID`
                                                ) === "false" && (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors?.owners?.[index]?.passport ? "is-invalid" : ""}`}
                                                            placeholder={t(
                                                                "Enter your Passport Number"
                                                            )}
                                                            maxLength={15}
                                                            {...register(
                                                                `owners.${index}.passport`
                                                            )}
                                                        />
                                                        {errors?.owners?.[index]
                                                            ?.passport && (
                                                            <div className="invalid-feedback">
                                                                {t(
                                                                    errors
                                                                        .owners[
                                                                        index
                                                                    ].passport
                                                                        .message
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="remove-owner">
                                            {fields.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="remove-btn"
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="pb-3">
                                    <button
                                        type="button"
                                        className="linkb"
                                        onClick={() =>
                                            append({
                                                ownerName: "",
                                                nationality: "",
                                                eid: "",
                                                passport: "",
                                                dob: null,
                                                phone: "",
                                                email: "",
                                                sharePercentage: "",
                                                useEID: "true",
                                            })
                                        }
                                    >
                                        {t("Add Owner")}{" "}
                                        <i className="fa-solid fa-plus ml-2"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="right">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                >
                                    {t("Next")}{" "}
                                    <i className="fa-solid fa-angle-right ml-2"></i>
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
