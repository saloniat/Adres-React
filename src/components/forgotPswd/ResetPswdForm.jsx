import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import PasswordInput from "../common/form/PasswordInput";
import Button from "../common/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPswdValidationSchema } from "../../utils/validations";
import { goodRegExp, strongRegExp, weakRegExp } from "../../helpers";
import { resetPassword } from "../../redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";
import { PasswordStrength } from "../../utils/constants";
import useTranslationHook from "../hooks/useTranslationHook";

const ResetPswdForm = () => {
    const {
        register,
        handleSubmit,
        control,
        clearErrors,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(resetPswdValidationSchema),
        mode: "all",
    });
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const reset_password_token = queryParams.get("token");
    const [state, setState] = useState({
        showPwd: {
            password: false,
            confirmPassword: false,
        },
        currentField: "",
        pswdStrength: "",
        token: reset_password_token,
    });
    const { t } = useTranslationHook();
    const { showPwd, currentField, pswdStrength, token } = state;
    const { Weak, Good, Strong } = PasswordStrength;
    const password = useWatch({
        control,
        name: "password",
    });
    const confirmPassword = useWatch({
        control,
        name: "confirmPassword",
    });

    const isResetPwdSucc = useSelector((state) => state.auth.isResetPwdSucc);

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }
    }, []);

    useEffect(() => {
        if (password && password === confirmPassword) {
            clearErrors("confirmPassword");
        }
        //eslint-disable-next-line
    }, [password, clearErrors]);

    useEffect(() => {
        const pswd = currentField === "password" ? password : confirmPassword;
        let strength = "";

        if (pswd) {
            if (strongRegExp.test(pswd)) strength = "Strong";
            else if (goodRegExp.test(pswd)) strength = "Good";
            else if (weakRegExp.test(pswd)) strength = "Weak";
            else strength = "";
        }

        setState((prev) => ({ ...prev, pswdStrength: strength }));
    }, [password, confirmPassword, currentField]);

    const validateConfirmPassword = (value) => {
        if (value && value !== password) {
            setError("confirmPassword", {
                type: "manual",
                message: "Unmatched Password",
            });
        } else {
            clearErrors("confirmPassword");
        }
    };

    const renderPasswordStrengthMeter = (unmatchedPswd) =>
        pswdStrength && (
            <>
                <div
                    className="input-icon-right peek-password-button"
                    data-peek-password="signupInputPassword"
                >
                    <span className="peek-password-icon icon-visibility"></span>
                </div>
                <div
                    className={"password-strength-group"}
                    data-strength={
                        pswdStrength === Weak
                            ? 1
                            : pswdStrength === Good
                              ? 2
                              : pswdStrength === Strong
                                ? 3
                                : ""
                    }
                >
                    <div
                        id="password-strength-meter"
                        className={`password-strength-meter ${unmatchedPswd ? "mt-3" : ""}`}
                    >
                        <div className="meter-block"></div>
                        <div className="meter-block"></div>
                        <div className="meter-block"></div>
                    </div>

                    {unmatchedPswd && errors["confirmPassword"] ? (
                        <></>
                    ) : (
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
                    )}
                </div>
            </>
        );

    const onSubmit = (data) => {
        const formData = {
            password: data.password,
            reset_token: token,
            domain_id: 3,
        };
        dispatch(resetPassword(formData, t));
    };

    return (
        <section className="login-wrap forgot-pwd">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div
                        className="col-lg-6 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        {isResetPwdSucc ? (
                            <div className="payment-box">
                                <div className="payment-check">
                                    <img
                                        src="/img/payment-check.svg"
                                        alt="Payment Check"
                                    />
                                </div>
                                <h4 className="display-4 mb-4">
                                    {t(
                                        "Your password has been reset successfully!"
                                    )}
                                </h4>
                                <div className="mb-4">
                                    <Link
                                        to="/sign-in"
                                        className="btn btn-primary btn-lg btn-full"
                                    >
                                        {t("Back to Login")}
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="login-box">
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    autoComplete="off"
                                    autoCapitalize="off"
                                >
                                    <h4 className="display-4 mb-4">
                                        {t("Reset Your Password")}
                                        <span>
                                            {t(
                                                "Create strong and secured new password."
                                            )}
                                        </span>
                                    </h4>

                                    <div className="mb-4">
                                        <PasswordInput
                                            id="password"
                                            className={
                                                errors.password
                                                    ? "form-control"
                                                    : "form-control mb-3"
                                            }
                                            minLength={6}
                                            maxLength={12}
                                            placeholder={t(
                                                "Enter your password"
                                            )}
                                            label={t("Password")}
                                            labelClassname="form-label"
                                            register={register}
                                            errors={errors}
                                            {...register("password")}
                                            handleShowPwd={() => {
                                                setState((prev) => ({
                                                    ...prev,
                                                    showPwd: {
                                                        ...prev.showPwd,
                                                        ["password"]:
                                                            !prev.showPwd[
                                                                "password"
                                                            ],
                                                    },
                                                }));
                                            }}
                                            showPwd={showPwd["password"]}
                                            onFocus={() =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    currentField: "password",
                                                }))
                                            }
                                        />
                                        {currentField === "password" &&
                                            !errors["password"] &&
                                            renderPasswordStrengthMeter()}
                                    </div>
                                    <div className="mb-4">
                                        <PasswordInput
                                            id="confirmPassword"
                                            className={
                                                errors.confirmPassword
                                                    ? "form-control"
                                                    : "form-control mb-3"
                                            }
                                            placeholder={t(
                                                "Confirm your password"
                                            )}
                                            label={t("Confirm Password")}
                                            labelClassname="form-label"
                                            register={register}
                                            {...register("confirmPassword", {
                                                onChange: (e) =>
                                                    validateConfirmPassword(
                                                        e.target.value
                                                    ),
                                            })}
                                            handleShowPwd={() => {
                                                setState((prev) => ({
                                                    ...prev,
                                                    showPwd: {
                                                        ...prev.showPwd,
                                                        ["confirmPassword"]:
                                                            !prev.showPwd[
                                                                "confirmPassword"
                                                            ],
                                                    },
                                                }));
                                            }}
                                            showPwd={showPwd["confirmPassword"]}
                                            onFocus={() =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    currentField:
                                                        "confirmPassword",
                                                }))
                                            }
                                        />
                                        {/* {currentField === "confirmPassword" &&
                                            renderPasswordStrengthMeter(
                                                "unmatchedPswd"
                                            )} */}
                                        {errors?.["confirmPassword"] && (
                                            <span className="text-danger">
                                                {t(
                                                    errors["confirmPassword"]
                                                        .message
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    <div className="clear">
                                        <Button
                                            className={
                                                "btn btn-primary btn-full btn-lg"
                                            }
                                            label={t("Reset Password")}
                                            type="submit"
                                        />
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResetPswdForm;
