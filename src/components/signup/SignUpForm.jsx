import React, { useEffect, useState, useRef } from "react";
import {
    signupFormFields,
    emailRegExp,
    weakRegExp,
    goodRegExp,
    strongRegExp,
    onlyAlaphaRegExp,
    handleKeyDown,
    initializeIntlTelInput,
    googleUserType,
} from "../../helpers/index";

import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../common/Button";
import Input from "../common/form/Input";
import PasswordInput from "../common/form/PasswordInput";
import "react-phone-number-input/style.css";
import MobileInput from "../common/form/MobileInput";
import {
    authAction,
    handleNoRemainAttempt,
    handlePaymentPage,
    handleSignUpStep,
    handleUserActivation,
    registerUser,
    sendOTP,
    verifyOTP,
} from "../../redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { PasswordStrength, SignUpStep } from "../../utils/constants";
import useTranslationHook from "../hooks/useTranslationHook";
import { handleVerificationStep } from "../../redux/action/verificationAction";

const SignUpForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setFocus,
        setValue,
        clearErrors,
        control,
        reset,
    } = useForm();

    const [state, setState] = useState({
        timer: 60,
        pswdStrength: "",
        currentField: "",
        showPwd: {
            password: false,
            confirmPassword: false,
        },
        countryCode: "",
        wrongCodeAttempt: 3,
        isWrongCode: false,
    });
    const [confirmOTP, setConfirmOTP] = useState(true);
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslationHook();
    const user = useSelector((state) => state.auth.user);
    const signUpStep = useSelector((state) => state.auth.signUpStep);
    const siteLoader = useSelector((state) => state.auth.siteLoader);
    const tempUserId = useSelector((state) => state.auth.tempUserId);
    const remainNoAttempt = useSelector((state) => state.auth.remainNoAttempt);

    const { timer, pswdStrength, currentField, showPwd, countryCode } = state;
    const { Weak, Good, Strong } = PasswordStrength;
    const { step_1, step_2, step_3, step_4 } = SignUpStep;
    const phoneNumber = useWatch({
        control,
        name: "phoneNo",
    });
    const password = useWatch({
        control,
        name: "password",
    });
    const confirmPassword = useWatch({
        control,
        name: "confirmPassword",
    });
    useEffect(() => {
        if (signUpStep === step_1) {
            setState((prev) => ({
                ...prev,
                wrongCodeAttempt: 3,
            }));

            initializeIntlTelInput({
                inputRef,
                countryCode: "971",
                setState,
            });
            return () => {
                const scriptToRemove =
                    document.getElementById("intlTelInputScript");
                if (scriptToRemove) scriptToRemove.remove();

                const stylesheetToRemove = document.getElementById(
                    "intlTelInputStylesheet"
                );
                if (stylesheetToRemove) stylesheetToRemove.remove();
            };
        }
        //eslint-disable-next-line
    }, [signUpStep]);

    useEffect(() => {
        if (signUpStep) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [signUpStep]);

    useEffect(() => {
        let countdown = null;

        if (signUpStep === step_2 && timer > 0) {
            countdown = setInterval(() => {
                setState((prev) => ({
                    ...prev,
                    timer: prev.timer - 1,
                }));
            }, 1000);
        } else if (timer === 0) {
            clearInterval(countdown);
        }

        return () => {
            if (countdown) clearInterval(countdown);
        };
        //eslint-disable-next-line
    }, [signUpStep, timer]);

    useEffect(() => {
        if (state.wrongCodeAttempt === 0) {
            reset();
            dispatch(handleSignUpStep(1));
        }
        //eslint-disable-next-line
    }, [state.wrongCodeAttempt]);

    const handleOtpInput = (index, value) => {
        const otpFields = ["otpDigit1", "otpDigit2", "otpDigit3", "otpDigit4"];

        setValue(otpFields[index], value);

        if (value.length === 1 && index < 3) {
            setFocus(otpFields[index + 1]);
        } else if (value.length === 0 && index > 0) {
            setFocus(otpFields[index - 1]);
        }

        const updatedOtpValues = otpFields.map((field) => getValues(field));
        const otp = updatedOtpValues.join("");
        setConfirmOTP(otp.length !== 4);
    };

    const handleValidateOTP = () => {
        const otpFields = ["otpDigit1", "otpDigit2", "otpDigit3", "otpDigit4"];
        const updatedOtpValues = otpFields.map((field) => getValues(field));

        if (updatedOtpValues.every((digit) => digit && digit.length === 1)) {
            const otp = updatedOtpValues.join("");
            const body = {
                otp: otp,
                ...(!Object.keys(user || {}).length && {
                    phone_no: phoneNumber,
                    temp_user_id: tempUserId,
                }),
                ...(user?.signup_source === googleUserType && {
                    domain_id: 3,
                    signup_step: 4,
                }),
                ...(user?.user_id && { user_id: user.user_id }),
            };
            dispatch(verifyOTP(body, t));
            setState((prev) => ({
                ...prev,
                wrongCodeAttempt: prev.wrongCodeAttempt - 1,
                isWrongCode: true,
            }));
        }
    };

    const renderHeader = (signUpStep) => {
        switch (signUpStep) {
            case 1:
                return (
                    <h4 className="display-4 mb-4">
                        {t("Create Your Account")}
                        <span>
                            {t("Let’s begin by verifying your phone number.")}
                        </span>
                    </h4>
                );

            case 2:
                return (
                    <h4 className="display-4 mb-4">
                        {t("Enter Verification Code")}
                        <span>
                            {t("sent code text", {
                                dynamicValue: ` +${countryCode} ${phoneNumber}`,
                            })}
                        </span>
                    </h4>
                );
            case 3:
                return (
                    <h4 className="display-4 mb-4">
                        {t("Complete Your Profile")}
                        <span>
                            {t("Just a few details to set up your account,")}
                        </span>
                    </h4>
                );
            case 4:
                return (
                    <>
                        <div className="payment-check">
                            <img
                                src="/img/payment-check.svg"
                                alt="Payment Check"
                            />
                        </div>
                        <h4 className="display-4 mb-4">
                            {t("Your Account is Ready!")}
                            <span>{t("Account Confirmation text")}</span>
                        </h4>
                        <div className="mb-4">
                            <button
                                className="btn btn-primary btn-lg btn-full"
                                onClick={async () => {
                                    dispatch(handleVerificationStep(2));
                                    if (
                                        user?.signup_source === googleUserType
                                    ) {
                                        dispatch(
                                            authAction.loadUser({
                                                isProcessIncomplete: true,
                                            })
                                        );
                                        const params = {
                                            domain_id: 3,
                                            skip_step: 1,
                                            signup_step: 5,
                                            ...(user?.user_id && {
                                                user_id: user.user_id,
                                            }),
                                        };
                                        dispatch(
                                            handleUserActivation(
                                                params,
                                                navigate,
                                                "/verify"
                                            )
                                        );
                                    } else {
                                        navigate("/verify");
                                    }
                                }}
                            >
                                {t("Verify Account Now")}
                            </button>
                        </div>
                        <div className="text-center">
                            <button
                                className="skip-text"
                                onClick={async () => {
                                    if (
                                        user?.signup_source === googleUserType
                                    ) {
                                        const params = {
                                            domain_id: 3,
                                            skip_step: 1,
                                            signup_step: 5,
                                            ...(user?.user_id && {
                                                user_id: user.user_id,
                                            }),
                                        };
                                        dispatch(
                                            handleUserActivation(
                                                params,
                                                navigate
                                            )
                                        );
                                    } else {
                                        dispatch(
                                            authAction.loadUser({
                                                isProcessIncomplete: false,
                                            })
                                        );
                                    }
                                }}
                            >
                                {t("Skip for Now")}
                            </button>
                        </div>
                    </>
                );
            default:
                <></>;
        }
    };

    const validationRules = (item) => ({
        ...(item.id === 1 && {
            required: "This field is required",

            validate: () => {
                const iti = window.$(inputRef.current).intlTelInput();
                const isValid = iti.intlTelInput("isValidNumber");
                if (!isValid) {
                    return "Please enter a valid phone number";
                }
                return true;
            },
        }),
        ...(item.id === 4 && {
            required: "This field is required",
            minLength: {
                value: item.minLength,
                message: "Min length text",
            },
            maxLength: {
                value: item.maxLength,
                message: "Max length text",
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
        ...(item.id === 5 && {
            required: "This field is required",
            pattern: {
                value: emailRegExp,
                message: "Please enter a valid email address",
            },
        }),
        ...(item.id === 6 && {
            required: "This field is required",
            minLength: {
                value: item.minLength,
                message: "Password min length text",
            },
            maxLength: {
                value: item.maxLength,
                message: "Max length text",
            },
            validate: {
                noLeadingTrailingSpaces: (value) =>
                    /^[^\s].*[^\s]$/.test(value) ||
                    "Password cannot include leading and trailing spaces",
                testUpperCase: (value) =>
                    /[A-Z]/.test(value) || "Upper Case text",
                testLowerCase: (value) =>
                    /[a-z]/.test(value) || "Lower Case text",
                testNumber: (value) =>
                    /\d/.test(value) || "Number Case text",
                testSpecialCase: (value) =>
                    /[!@#$%^&*]/.test(value) || "Special Case text",
                matchConfirmPassword: (value) => {
                    const confirmPassword = getValues("confirmPassword");
                    if (confirmPassword && value === confirmPassword) {
                        clearErrors("confirmPassword");
                    }
                    return true;
                },
            },
        }),
        ...(item.id === 7 && {
            required: "This field is required",
            validate: (value) => {
                const password = getValues("password");

                if (value && value !== password) {
                    return "Unmatched Password";
                }
                return true;
            },
        }),
    });

    useEffect(() => {
        const pswd =
            currentField === "password" ? password : confirmPassword || "";
        let strength = "";
        if (pswd) {
            if (strongRegExp.test(pswd)) strength = "Strong";
            else if (goodRegExp.test(pswd)) strength = "Good";
            else if (weakRegExp.test(pswd)) strength = "Weak";
        }
        setState((prev) => ({ ...prev, pswdStrength: strength }));
    }, [password, confirmPassword, currentField]);

    const renderInputField = (item) => (
        <div className="mb-4" key={item.id}>
            {item.id === 1 ? (
                <MobileInput
                    type={item.type}
                    id={item.id}
                    className={item.classname}
                    placeholder={t(item.placeholder)}
                    label={t(item.label)}
                    labelClassname={item.labelClassname}
                    error={errors?.phone?.message}
                    inputRef={inputRef}
                    register={register}
                    name={item.name}
                    validationRules={validationRules(item)}
                    errors={errors}
                    onKeyDown={handleKeyDown}
                    maxLength={15}
                />
            ) : item.type === "password" ? (
                <PasswordInput
                    {...item}
                    id={item.id}
                    className={`${item.classname} ${errors[item.name] ? "" : "mb-3"}`}
                    placeholder={item.placeholder}
                    label={t(`${item.label}`)}
                    labelClassname={item.labelClassname}
                    register={register}
                    errors={errors}
                    {...register(item.name, validationRules(item))}
                    onFocus={() =>
                        setState((prev) => ({
                            ...prev,
                            currentField: item.name,
                        }))
                    }
                    handleShowPwd={() => {
                        setState((prev) => ({
                            ...prev,
                            showPwd: {
                                ...prev.showPwd,
                                [item.name]: !prev.showPwd[item.name],
                            },
                        }));
                    }}
                    showPwd={showPwd[item.name]}
                />
            ) : (
                <Input
                    {...item}
                    type={item.type}
                    id={item.id}
                    className={item.classname}
                    placeholder={t(`${item.placeholder}`)}
                    label={t(`${item.label}`)}
                    labelClassname={item.labelClassname}
                    register={register}
                    errors={errors}
                    {...register(item.name, validationRules(item))}
                />
            )}
            {/* item.id === 7 show the password strength for confirmPassword */}
            {/* {(item.id === 6 || item.id === 7) && */}
            {item.id === 6 &&
                currentField === item.name &&
                !("password" in errors) &&
                renderPasswordStrengthMeter()}
        </div>
    );

    const renderOtpInput = (item) => (
        <div className="mb-4" key={item.id}>
            <div className="ph-list">
                {item?.inputField?.map((field, index) => (
                    <div className="col" key={index}>
                        <Input
                            type="text"
                            className={item.classname}
                            register={register}
                            errors={errors}
                            {...register(field.name, {
                                required: "This field is required",
                            })}
                            onKeyDown={(e) => {
                                if (
                                    e.key.length === 1 &&
                                    !/[0-9]/.test(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value.slice(-1);
                                handleOtpInput(index, value);
                                e.target.value = value;
                            }}
                            onFocus={() =>
                                setState((prev) => ({
                                    ...prev,
                                    isWrongCode: false,
                                }))
                            }
                        />
                    </div>
                ))}
            </div>
            {Object.keys(errors).some((key) => key.includes("otpDigit")) && (
                <div className="required font14">
                    {t("All OTP fields are required.")}
                </div>
            )}
            {!siteLoader && state.isWrongCode && state.wrongCodeAttempt < 3 && (
                <div className="required font14">
                    {t("Attempts Left text", {
                        attempts: state.wrongCodeAttempt,
                    })}
                </div>
            )}
        </div>
    );
    const renderPasswordStrengthMeter = () =>
        pswdStrength && (
            <div
                className="password-strength-group"
                data-strength={
                    pswdStrength === Weak
                        ? "1"
                        : pswdStrength === Good
                            ? "2"
                            : pswdStrength === Strong
                                ? "3"
                                : ""
                }
            >
                <div
                    id="password-strength-meter"
                    className="password-strength-meter"
                >
                    <div className="meter-block"></div>
                    <div className="meter-block"></div>
                    <div className="meter-block"></div>
                </div>
                <div className="password-strength-message">
                    <div className="message-item week-text">
                        {t("Weak Password")}
                    </div>

                    <div className="message-item good-text">
                        {t("Good Password")}
                    </div>

                    <div className="message-item strong-text">
                        {t("Strong Password")}
                    </div>
                </div>
            </div>
        );

    const renderFormField = (item) => {
        switch (item.option_type_display) {
            case "Input":
                return renderInputField(item);
            case "OtpInput":
                return renderOtpInput(item);
            default:
                return null;
        }
    };
    const handleResendCode = () => {
        handleSendOtp();
        if (!remainNoAttempt) {
            setState((prev) => ({
                ...prev,
                timer: 60,
            }));
        }
    };

    const handleSendOtp = () => {
        const body = {
            phone_no: phoneNumber,
            phone_country_code: countryCode,
            ...(user?.user_id && { user_id: user.user_id }),
        };
        dispatch(sendOTP(body, t));
        setState((prev) => ({
            ...prev,
            wrongCodeAttempt: 3,
        }));
    };

    const onSubmit = async (data) => {
        if (signUpStep === step_1) {
            const body = {
                phone_no: data.phoneNo.replace(/\s+/g, ""),
                phone_country_code: countryCode,
                ...(user?.user_id && { user_id: user.user_id }),
            };
            dispatch(sendOTP(body, t));
            dispatch(handleNoRemainAttempt(false));
        } else if (signUpStep === step_2) {
            setState((prev) => ({
                ...prev,
                timer: 60,
            }));
            toast.success(t("Resending OTP successfully"));
        } else if (signUpStep === step_3) {
            if (user?.signup_source) {
                const params = {
                    skip_step: 1,
                    signup_step: 5,
                    ...(user?.user_id && { user_id: user.user_id }),
                };
                const { status } = await dispatch(handlePaymentPage(params));
                if (status === 200) dispatch(handleSignUpStep(4));
            } else {
                const { phoneNo, name, email, password } = data;
                const userData = {
                    domain_id: 3,
                    described_by: "1",
                    first_name: name,
                    email: email,
                    password: password,
                    phone_no: phoneNo,
                    agree_term: 1,
                    temp_user_id: tempUserId,
                };
                dispatch(registerUser(userData));
            }
        }
    };

    return (
        <section className="login-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div
                        className="col-lg-6 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            autoComplete="off"
                            autoCapitalize="off"
                        >
                            <div
                                className={
                                    signUpStep === step_4
                                        ? "payment-box"
                                        : "login-box"
                                }
                            >
                                {renderHeader(signUpStep)}
                                {signupFormFields
                                    ?.filter((item) => item.step === signUpStep)
                                    .map((item) => renderFormField(item))}
                                {(signUpStep === step_1 ||
                                    signUpStep === step_2 ||
                                    signUpStep === step_3) && (
                                        <>
                                            {signUpStep === step_2 && (
                                                <div className="clear">
                                                    <Button
                                                        className={
                                                            "btn btn-primary btn-full btn-lg"
                                                        }
                                                        onClick={handleValidateOTP}
                                                        type={"button"}
                                                        disabled={confirmOTP}
                                                        label={t("Confirm")}
                                                    />
                                                </div>
                                            )}

                                            <div className="clear pt-2">
                                                <Button
                                                    className={
                                                        "btn btn-primary btn-full btn-lg"
                                                    }
                                                    type={
                                                        signUpStep === step_2
                                                            ? "button"
                                                            : "submit"
                                                    }
                                                    disabled={
                                                        signUpStep === step_2 &&
                                                        (timer > 0 ||
                                                            remainNoAttempt)
                                                    }
                                                    onClick={() => {
                                                        if (signUpStep === step_2) {
                                                            handleResendCode();
                                                        }
                                                    }}
                                                    label={
                                                        signUpStep === step_1
                                                            ? t("Send Code")
                                                            : signUpStep === step_2
                                                                ? timer > 0 &&
                                                                    !siteLoader &&
                                                                    !remainNoAttempt
                                                                    ? timer >= 60
                                                                        ? t(
                                                                            "Resend Code text",
                                                                            {
                                                                                timer: `${Math.floor(
                                                                                    timer /
                                                                                    60
                                                                                )}:${timer % 60 < 10 ? "0" : ""}${timer %
                                                                                60
                                                                                    }`,
                                                                            }
                                                                        )
                                                                        : t(
                                                                            "Resend Code text",
                                                                            {
                                                                                timer,
                                                                            }
                                                                        )
                                                                    : t("Resend Code")
                                                                : signUpStep ===
                                                                step_3 &&
                                                                t("Next")
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default SignUpForm;
