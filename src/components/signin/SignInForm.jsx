import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../common/form/Input";
import PasswordInput from "../common/form/PasswordInput";
import Button from "../common/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignInValidationSchema } from "../../utils/validations";
import "react-toastify/dist/ReactToastify.css";
import Checkbox from "../common/form/Checkbox";
import { useDispatch } from "react-redux";
import {
    authAction,
    handleSignUpStep,
    login,
    resetLinkSend,
} from "../../redux/action/authAction";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import LoginWithSocialMedia from "./LoginWithSocialMedia";
import useTranslationHook from "../hooks/useTranslationHook";

const SignInForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(SignInValidationSchema),
        defaultValues: {
            rememberMe: true,
        },
    });
    const { t } = useTranslationHook();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get("redirect");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [state, setState] = useState({
        showPwd: false,
    });
    const { showPwd } = state;

    useEffect(() => {
        reset();
        if (Cookies.get("email")) {
            const bytes = CryptoJS.AES.decrypt(
                Cookies.get("email"),
                `${process.env.REACT_APP_ENCRYPT_DECRYPT_KEY}`
            );
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            setValue("email", originalText);
        }
        if (Cookies.get("password")) {
            const bytes = CryptoJS.AES.decrypt(
                Cookies.get("password"),
                `${process.env.REACT_APP_ENCRYPT_DECRYPT_KEY}`
            );
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            setValue("password", originalText);
        }
        // eslint-disable-next-line
    }, []);

    const onSubmit = (data) => {
        const formData = { ...data, domain_id: 3 };
        dispatch(login(formData, navigate, redirectUrl, t));
    };

    return (
        <section className="login-wrap">
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
                                    {t("Login to Your Account")}
                                    <span>
                                        {t("Welcome back, you’ve been missed!")}
                                    </span>
                                </h4>

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
                                <div className="mb-4">
                                    <PasswordInput
                                        id="password"
                                        className="form-control"
                                        placeholder={t("Enter your password")}
                                        label={t("Password")}
                                        labelClassname="form-label"
                                        register={register}
                                        errors={errors}
                                        {...register("password")}
                                        handleShowPwd={() =>
                                            setState((prev) => ({
                                                ...prev,
                                                showPwd: !showPwd,
                                            }))
                                        }
                                        showPwd={showPwd}
                                    />
                                </div>
                                <div className="mb-4">
                                    <Button
                                        className={
                                            "btn btn-primary btn-full btn-lg"
                                        }
                                        label={t("Login")}
                                        type="submit"
                                    />
                                </div>

                                <div className="mb-4 login-check">
                                    <div className="check">
                                        <Checkbox
                                            type="checkbox"
                                            name="rememberMe"
                                            control={control}
                                            id="rememberMe"
                                            className="css-checkbox"
                                            labelClassName="css-label"
                                            label={t("Remember Me")}
                                            rules={{
                                                required: t(
                                                    "This field is required"
                                                ),
                                            }}
                                        />
                                    </div>
                                    <div className="forgot">
                                        <Link
                                            to="/forgot-password"
                                            onClick={() => {
                                                dispatch(resetLinkSend(false));
                                                sessionStorage.removeItem(
                                                    "isResetLinkSend"
                                                );
                                            }}
                                        >
                                            {t("Forgot Password ?")}
                                        </Link>
                                    </div>
                                </div>
                            </form>

                            <div className="mb-4 seperate">
                                <span>{t("or")}</span>
                            </div>
                            {/* <div className="mb-4">
                                <a
                                    href="void:{0}"
                                    className="btn btn-white btn-full login-btn"
                                >
                                    <img
                                        className="mr4"
                                        src="img/thumb-icon.svg"
                                        alt="thumb icon"
                                    />
                                    {t("Login with UAE PASS")}
                                </a>
                            </div> */}
                            <div className="mb-4 ">
                                <LoginWithSocialMedia />
                            </div>
                            <div className="text-center">
                                <Link
                                    to="/sign-up"
                                    onClick={() => {
                                        dispatch(handleSignUpStep(1));
                                        dispatch(authAction.loadUser(null));
                                    }}
                                >
                                    {t("Don’t Have an Account?")}{" "}
                                    <strong>{t("Signup")}</strong>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignInForm;
