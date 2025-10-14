import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import {
    handleProfileEdit,
    handleProfileUpdate,
    sendEmailVerifyLink,
} from "../../redux/action/profileAction";
import Button from "../common/Button";
import Input from "../common/form/Input";
import MobileInput from "../common/form/MobileInput";
import {
    emailRegExp,
    onlyAlaphaRegExp,
    handleKeyDown,
    initializeIntlTelInput,
} from "../../helpers";
import {
    handleOtpModal,
    handlePersonalInfoUpdate,
} from "../../redux/slice/profileSlice";
import useTranslationHook from "../hooks/useTranslationHook";
import OtpInputModal from "./OtpInputModal";
import { handleNoRemainAttempt, sendOTP } from "../../redux/action/authAction";

const PersonalInfo = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        getValues,
        formState: { errors },
    } = useForm({});

    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    const inputRef = useRef(null);
    const user = useSelector((state) => state.auth.user);
    const isProfileEdit = useSelector((state) => state.profile.isProfileEdit);
    const isPersonalInfoUpdate = useSelector(
        (state) => state.profile.isPersonalInfoUpdate
    );

    const [state, setState] = useState({
        countryCode: "",
        counter: 5,
    });

    useEffect(() => {
        dispatch(handleProfileEdit(false));
        reset();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        let timer;

        if (isPersonalInfoUpdate) {
            setState((prev) => ({ ...prev, counter: 5 }));

            timer = setInterval(() => {
                setState((prev) => {
                    if (prev.counter <= 1) {
                        clearInterval(timer);
                        dispatch(handlePersonalInfoUpdate(false));
                        return { ...prev, counter: 0 };
                    }
                    return { ...prev, counter: prev.counter - 1 };
                });
            }, 1000);
        }

        return () => clearInterval(timer);
        // eslint-disable-next-line
    }, [isPersonalInfoUpdate]);

    useEffect(() => {
        if (user) {
            setValue("name", user.first_name || "");
            setValue("email", user.email || "");
            setValue("phone", user.phone_no || "");
        }
    }, [user, setValue]);

    useEffect(() => {
        if (isProfileEdit) {
            initializeIntlTelInput({
                inputRef,
                countryCode: user?.phone_country_code,
                setState,
            });
        }

        return () => {
            const scriptToRemove =
                document.getElementById("intlTelInputScript");
            if (scriptToRemove) scriptToRemove.remove();

            const stylesheetToRemove = document.getElementById(
                "intlTelInputStylesheet"
            );
            if (stylesheetToRemove) stylesheetToRemove.remove();
        };
        //eslint-disable-next-line
    }, [isProfileEdit]);

    const validationRules = (id) => ({
        ...(id === 1 && {
            required: t("This field is required"),
            minLength: {
                value: 5,
                message: t("Min length text", {
                    minLength: 5,
                }),
            },
            maxLength: {
                value: 30,
                message: t("Max length text", {
                    minLength: 30,
                }),
            },
            validate: {
                onlyAlphabets: (value) =>
                    onlyAlaphaRegExp.test(value) ||
                    t("Please enter a valid name"),
                noLeadingTrailingSpaces: (value) =>
                    /^[^\s].*[^\s]$/.test(value) ||
                    t("Full name cannot include leading and trailing spaces"),
            },
        }),
        ...(id === 2 && {
            required: t("This field is required"),

            validate: () => {
                const iti = window.$(inputRef.current).intlTelInput();
                const isValid = iti.intlTelInput("isValidNumber");
                if (!isValid) {
                    return t("Please enter a valid phone number");
                }
                return true;
            },
        }),
        ...(id === 3 && {
            required: t("This field is required"),
            pattern: {
                value: emailRegExp,
                message: t("Please enter a valid email address"),
            },
        }),
    });

    const onSubmit = (data) => {
        const oldPhoneNo = user.phone_no.replace(/\s+/g, "");
        const newPhoneNo = data.phone.replace(/\s+/g, "");

        if (
            user.email === data.email &&
            user.first_name === data.name &&
            oldPhoneNo === newPhoneNo
        ) {
            dispatch(handleProfileEdit(false));
            return;
        }
        const profileData = {
            site_id: user.site_id,
            user_id: user.user_id,
            first_name: data.name,
            email: data.email,
            phone_no: data.phone,
            phone_country_code: state.countryCode,
        };
        // for email changed when mobile number is same
        if (user.email !== data.email && oldPhoneNo === newPhoneNo) {
            dispatch(handleProfileUpdate(profileData, "emailChanged"));
            dispatch(handleProfileEdit(false));
        } else if (
            // when mobile number changed and both email & mobile number is changed
            oldPhoneNo !== newPhoneNo ||
            (user.email !== data.email && oldPhoneNo !== newPhoneNo)
        ) {
            const body = {
                phone_no: newPhoneNo,
                phone_country_code: state.countryCode,
                user_id: user.user_id,
            };
            dispatch(sendOTP(body, t));
            dispatch(handleNoRemainAttempt(false));
            dispatch(handleOtpModal(true));
        } else {
            // for name changed only
            dispatch(handleProfileUpdate(profileData));
            dispatch(handleProfileEdit(false));
        }
    };

    return (
        <>
            <Breadcrumb
                links={[
                    { url: "/", name: t("Home") },
                    { url: "/profile-setting", name: t("Profile") },
                    { url: "", name: t("Personal Information") },
                ]}
            />
            {isProfileEdit ? (
                <section className="profile-section">
                    <div className="container py-5">
                        <div className="row justify-content-md-center">
                            <div
                                className="col-lg-8 wow fadeInUp"
                                data-wow-delay="0.5s"
                            >
                                <div className="profile-wrap login-wrap">
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        autoComplete="off"
                                        autoCapitalize="off"
                                    >
                                        <div className="profile-top">
                                            <h2>{t("Personal Information")}</h2>
                                            <Button
                                                className={
                                                    "btn btn-primary btn-md"
                                                }
                                                label={t("Save")}
                                                type="submit"
                                            />
                                        </div>
                                        <div className="login-box">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-4">
                                                        <Input
                                                            type="text"
                                                            id="name"
                                                            className="form-control"
                                                            placeholder={t(
                                                                "Enter your full name"
                                                            )}
                                                            label={t(
                                                                "Full Name"
                                                            )}
                                                            labelClassname="form-label"
                                                            register={register}
                                                            errors={errors}
                                                            {...register(
                                                                "name",
                                                                validationRules(
                                                                    1
                                                                )
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-4">
                                                        <MobileInput
                                                            type="text"
                                                            id="phone"
                                                            className="form-control"
                                                            placeholder={t(
                                                                "Phone Number"
                                                            )}
                                                            label={t(
                                                                "Phone Number"
                                                            )}
                                                            labelClassname="form-label"
                                                            error={
                                                                errors?.phone
                                                                    ?.message
                                                            }
                                                            inputRef={inputRef}
                                                            register={register}
                                                            name="phone"
                                                            validationRules={validationRules(
                                                                2
                                                            )}
                                                            errors={errors}
                                                            onKeyDown={
                                                                handleKeyDown
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-0">
                                                        <Input
                                                            type="email"
                                                            id="email"
                                                            className="form-control"
                                                            placeholder={t(
                                                                "Enter your email"
                                                            )}
                                                            label={t("Email")}
                                                            labelClassname="form-label"
                                                            register={register}
                                                            errors={errors}
                                                            {...register(
                                                                "email",
                                                                validationRules(
                                                                    3
                                                                )
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <OtpInputModal
                        phone_no={getValues("phone")}
                        phone_country_code={state.countryCode}
                        name={getValues("name")}
                        email={getValues("email")}
                    />
                </section>
            ) : (
                <section className="profile-section">
                    <div className="container py-5">
                        <div className="row justify-content-md-center">
                            <div
                                className="col-lg-8 wow fadeInUp"
                                data-wow-delay="0.5s"
                            >
                                <div className="profile-wrap">
                                    <div className="profile-top">
                                        <h2>{t("Personal Information")}</h2>
                                        <Link
                                            to=""
                                            onClick={() =>
                                                dispatch(
                                                    handleProfileEdit(true)
                                                )
                                            }
                                            className="btn btn-primary btn-md"
                                        >
                                            {t("Edit")}
                                        </Link>
                                    </div>
                                    <div className="basicInfo">
                                        <h4>{t("Basic Info")}</h4>
                                        <ul className="info-list">
                                            <li>
                                                {t("Full Name")}
                                                <strong>
                                                    {t(user?.first_name)}
                                                </strong>
                                            </li>
                                            <li>
                                                {t("Mobile Number")}
                                                <strong>
                                                    {user?.phone_no &&
                                                        `+${t(user?.phone_country_code)} - ${t(user?.phone_no)}`}
                                                </strong>
                                            </li>
                                            <li>
                                                {t("Email")}
                                                <strong>
                                                    {t(user?.email)}{" "}
                                                    {user?.is_email_verified && (
                                                        <i className="fa-solid fa-circle-check green"></i>
                                                    )}
                                                </strong>
                                            </li>
                                        </ul>

                                        <div className="clear">
                                            {!user?.is_email_verified && (
                                                <Link
                                                    to=""
                                                    onClick={() => {
                                                        dispatch(
                                                            sendEmailVerifyLink(
                                                                {
                                                                    user_id:
                                                                        user.user_id,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                    className="btn btn-primary"
                                                >
                                                    <i className="fa-solid fa-envelope mr4"></i>{" "}
                                                    {t("Verify Email")}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isPersonalInfoUpdate && state.counter > 0 && (
                                <div className="offset-lg-8 col-lg-4">
                                    <div className="alert alert-success">
                                        <img
                                            src="/img/check.svg"
                                            alt="check icon"
                                        />{" "}
                                        {t("Personal Information Updated!")}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default PersonalInfo;
