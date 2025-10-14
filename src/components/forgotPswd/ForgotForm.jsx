import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../common/form/Input";
import Button from "../common/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgotPswdValidationSchema } from "../../utils/validations";
import "react-toastify/dist/ReactToastify.css";
import {
    forgotPassword,
    resetLinkSend,
    handleNoRemainAttempt,
} from "../../redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";
import useTranslationHook from "../hooks/useTranslationHook";

const ForgotForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(ForgotPswdValidationSchema),
    });

    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    const isResetLinkSend = useSelector((state) => state.auth.isResetLinkSend);
    const remainNoAttempt = useSelector((state) => state.auth.remainNoAttempt);
    const siteLoader = useSelector((state) => state.auth.siteLoader);
    const [state, setState] = useState({
        email: "",
        timer: 0,
    });
    const { timer } = state;

    useLayoutEffect(() => {
        const timerStart = sessionStorage.getItem("timerStart");

        const isLinkSend = sessionStorage.getItem("isResetLinkSend");
        if (isLinkSend) {
            dispatch(resetLinkSend(true));
        }

        if (timerStart) {
            const elapsed = Math.floor(
                (Date.now() - Number(timerStart)) / 1000
            );
            const remainingTime = Math.max(30 - elapsed, 0);
            if (remainingTime) {
                setState((prev) => ({ ...prev, timer: remainingTime }));
            }
        }
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        let countdown = null;
        if (isResetLinkSend && timer > 0) {
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
    }, [isResetLinkSend, timer]);

    const handleTimer = (email) => {
        sessionStorage.setItem("timerStart", Date.now());
        setState((prev) => ({
            ...prev,
            email,
            timer: 30,
        }));

        return true;
    };

    const handleResetLink = () => {
        const email = sessionStorage.getItem("email");
        if (handleTimer(email)) {
            const formData = { email, domain_id: 3 };
            dispatch(forgotPassword(formData, t));
        }
    };

    const onSubmit = (data) => {
        if (handleTimer(data.email)) {
            sessionStorage.setItem("email", data.email);
            sessionStorage.setItem("isResetLinkSend", true);
            dispatch(handleNoRemainAttempt(false));
            const formData = { ...data, domain_id: 3 };
            dispatch(forgotPassword(formData, t));
        }
    };

    return (
        <section className="login-wrap forgot-pwd">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div
                        className="col-lg-6 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <div className="login-box">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                autoComplete="off"
                                autoCapitalize="off"
                            >
                                <h4 className="display-4 mb-4">
                                    {isResetLinkSend
                                        ? t("Check Your Email")
                                        : t("Forgot Password")}
                                    <span>
                                        {isResetLinkSend
                                            ? t("Reset Link text", {
                                                  email: sessionStorage.getItem(
                                                      "email"
                                                  ),
                                              })
                                            : t(
                                                  "Enter your email address to reset password."
                                              )}
                                    </span>
                                </h4>

                                {!isResetLinkSend && (
                                    <div className="mb-4">
                                        <Input
                                            type="text"
                                            id="email"
                                            className="form-control"
                                            placeholder={t("Enter your email")}
                                            label={t("Email")}
                                            labelClassname="form-label"
                                            register={register}
                                            errors={errors}
                                            {...register("email")}
                                        />
                                    </div>
                                )}
                                <div className="mb-4">
                                    <Button
                                        className={
                                            "btn btn-primary btn-full btn-lg"
                                        }
                                        type={
                                            isResetLinkSend
                                                ? "button"
                                                : "submit"
                                        }
                                        disabled={
                                            isResetLinkSend &&
                                            (timer > 0 || remainNoAttempt)
                                        }
                                        label={
                                            isResetLinkSend
                                                ? timer > 0 &&
                                                  !siteLoader &&
                                                  !remainNoAttempt
                                                    ? t("Resend Link text", {
                                                          timer,
                                                      })
                                                    : t("Resend Link")
                                                : t("Send Link")
                                        }
                                        onClick={() => {
                                            if (isResetLinkSend) {
                                                handleResetLink();
                                            }
                                        }}
                                    />
                                </div>

                                <div className="text-center">
                                    <Link
                                        to="/sign-in"
                                        className="back-login-link"
                                        onClick={() => {
                                            dispatch(resetLinkSend(false));
                                            sessionStorage.removeItem(
                                                "timerStart"
                                            );
                                            sessionStorage.removeItem(
                                                "isResetLinkSend"
                                            );
                                        }}
                                    >
                                        {t("Back to Login")}
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotForm;
