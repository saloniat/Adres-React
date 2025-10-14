import React, { useEffect, useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { Link } from "react-router-dom";
import {
    handleProfileEdit,
    handleChangePwd,
} from "../../redux/action/profileAction";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import PasswordInput from "../common/form/PasswordInput";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { goodRegExp, strongRegExp, weakRegExp } from "../../helpers";
import { PasswordStrength } from "../../utils/constants";
import { changePswdValidationSchema } from "../../utils/validations";
import Checkbox from "../common/form/Checkbox";
import { toggleNotification } from "../../redux/slice/notificationSlice";
import { setNotificationSetting } from "../../redux/action/notificationAction";
import useDidMountEffect from "../hooks/useDidMountEffect";
import useTranslationHook from "../hooks/useTranslationHook";

const Account = () => {
    const allow_notifications = useSelector(
        (state) => state.notification.allow_notifications,
        shallowEqual
    );
    const { t } = useTranslationHook();

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            notification: allow_notifications,
        },
        resolver: yupResolver(changePswdValidationSchema),
    });
    const dispatch = useDispatch();
    const [state, setState] = useState({
        showPwd: {
            password: false,
            confirmPassword: false,
        },
        pswdStrength: "",
        passwordsMatch: false,
    });
    const confirmPassword = useWatch({
        control,
        name: "confirmPassword",
    });
    const notification = watch("notification");
    const { showPwd, pswdStrength, passwordsMatch } = state;
    const { Weak, Good, Strong } = PasswordStrength;
    const isProfileEdit = useSelector((state) => state.profile.isProfileEdit);
    const user = useSelector((state) => state.auth.user, shallowEqual);

    useEffect(() => {
        dispatch(handleProfileEdit(false));
        //eslint-disable-next-line
    }, []);

    useDidMountEffect(() => {
        dispatch(toggleNotification(notification));
    }, [notification]);

    useDidMountEffect(() => {
        dispatch(setNotificationSetting());
    }, [allow_notifications]);

    const handleFormReset = () => {
        reset();
    };

    const handlePasswordChange = (password) => {
        let strength = "";

        if (strongRegExp.test(password)) strength = "Strong";
        else if (goodRegExp.test(password)) strength = "Good";
        else if (weakRegExp.test(password)) strength = "Weak";

        setState((prev) => ({ ...prev, pswdStrength: strength }));
    };

    const matchedPassword = (confirmPassword) => {
        const newPassword = watch("newPassword");
        const isMatched = newPassword === confirmPassword;

        setState((prev) => ({
            ...prev,
            passwordsMatch: isMatched,
        }));
    };

    const renderPasswordStrengthMeter = () =>
        pswdStrength && (
            <>
                <div
                    className="input-icon-right peek-password-button"
                    data-peek-password="signupInputPassword"
                >
                    <span className="peek-password-icon icon-visibility"></span>
                </div>

                <div
                    className="password-strength-group"
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
                        className="password-strength-meter"
                    >
                        <div className="meter-block"></div>
                        <div className="meter-block"></div>
                        <div className="meter-block"></div>
                    </div>

                    <div className="password-strength-message mb-2">
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
            </>
        );

    const onSubmit = (data) => {
        const formData = {
            password: data.currentPassword,
            new_password: data.newPassword,
            ...(user?.user_id && { user_id: user.user_id }),
        };
        dispatch(handleChangePwd(formData, handleFormReset));
        setState((prev) => ({ ...prev, pswdStrength: "", passwordsMatch: "" }));
    };

    return (
        <>
            <Breadcrumb
                links={[
                    { url: "/", name: t("Home") },
                    { url: "/profile-setting", name: t("Profile") },
                    { url: "", name: t("Account Settings") },
                ]}
            />
            <section className="profile-section">
                <div className="container py-5">
                    <div className="row justify-content-md-center">
                        <div
                            className="col-lg-8 wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            {isProfileEdit ? (
                                <div className="profile-wrap login-wrap">
                                    <div className="profile-top">
                                        <h2>{t("Change Password")}</h2>
                                    </div>
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        autoComplete="off"
                                        autoCapitalize="off"
                                    >
                                        <div className="login-box">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-4">
                                                        <PasswordInput
                                                            id="currentPassword"
                                                            className="form-control"
                                                            placeholder={t(
                                                                "**********"
                                                            )}
                                                            label={t(
                                                                "Current Password"
                                                            )}
                                                            labelClassname="form-label"
                                                            register={register}
                                                            errors={errors}
                                                            {...register(
                                                                "currentPassword"
                                                            )}
                                                            handleShowPwd={() => {
                                                                setState(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        showPwd:
                                                                            {
                                                                                ...prev.showPwd,
                                                                                ["currentPassword"]:
                                                                                    !prev
                                                                                        .showPwd[
                                                                                        "currentPassword"
                                                                                    ],
                                                                            },
                                                                    })
                                                                );
                                                            }}
                                                            showPwd={
                                                                showPwd[
                                                                    "currentPassword"
                                                                ]
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-4">
                                                        <PasswordInput
                                                            id="newPassword"
                                                            className={
                                                                errors.newPassword
                                                                    ? "form-control"
                                                                    : "form-control"
                                                            }
                                                            placeholder={t(
                                                                "**********"
                                                            )}
                                                            label={t(
                                                                "New Password"
                                                            )}
                                                            labelClassname="form-label"
                                                            register={register}
                                                            errors={errors}
                                                            {...register(
                                                                "newPassword",
                                                                {
                                                                    onChange: (
                                                                        e
                                                                    ) => {
                                                                        handlePasswordChange(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                        matchedPassword(
                                                                            confirmPassword
                                                                        );
                                                                    },
                                                                }
                                                            )}
                                                            handleShowPwd={() => {
                                                                setState(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        showPwd:
                                                                            {
                                                                                ...prev.showPwd,
                                                                                ["newPassword"]:
                                                                                    !prev
                                                                                        .showPwd[
                                                                                        "newPassword"
                                                                                    ],
                                                                            },
                                                                    })
                                                                );
                                                            }}
                                                            showPwd={
                                                                showPwd[
                                                                    "newPassword"
                                                                ]
                                                            }
                                                        />
                                                        {renderPasswordStrengthMeter()}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-4">
                                                        <PasswordInput
                                                            id="confirmPassword"
                                                            className="form-control"
                                                            placeholder={t(
                                                                "**********"
                                                            )}
                                                            label={t(
                                                                "Confirm Password"
                                                            )}
                                                            labelClassname="form-label"
                                                            register={register}
                                                            errors={errors}
                                                            {...register(
                                                                "confirmPassword",
                                                                {
                                                                    onChange: (
                                                                        e
                                                                    ) => {
                                                                        matchedPassword(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    },
                                                                }
                                                            )}
                                                            handleShowPwd={() => {
                                                                setState(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        showPwd:
                                                                            {
                                                                                ...prev.showPwd,
                                                                                ["confirmPassword"]:
                                                                                    !prev
                                                                                        .showPwd[
                                                                                        "confirmPassword"
                                                                                    ],
                                                                            },
                                                                    })
                                                                );
                                                            }}
                                                            showPwd={
                                                                showPwd[
                                                                    "confirmPassword"
                                                                ]
                                                            }
                                                        />
                                                    </div>
                                                    {passwordsMatch && (
                                                        <div className="matched">
                                                            <img
                                                                src="/img/check.svg"
                                                                alt=""
                                                            />
                                                            {t("Matched")}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                {t("Submit")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="profile-wrap">
                                    <div className="profile-top">
                                        <h2>{t("Account Settings")}</h2>
                                    </div>
                                    <div className="basicInfo">
                                        <ul className="settings-list">
                                            <li>
                                                <div className="allow-noti">
                                                    <img
                                                        src="/img/allow-notification.svg"
                                                        alt="Notification icon"
                                                        className="mr4"
                                                    />
                                                    {t("Allow Notifications")}
                                                </div>
                                                <div className="form-check form-switch">
                                                    <Checkbox
                                                        type="checkbox"
                                                        name="notification"
                                                        control={control}
                                                        id="flexSwitchCheckChecked"
                                                        className="form-check-input"
                                                        labelClassName="form-check-label"
                                                        label=""
                                                    />
                                                </div>
                                            </li>
                                            <Link
                                                to=""
                                                onClick={() =>
                                                    dispatch(
                                                        handleProfileEdit(true)
                                                    )
                                                }
                                            >
                                                <li className="arrow">
                                                    <div className="allow-noti">
                                                        <img
                                                            src="/img/change.password.svg"
                                                            alt="Password icon"
                                                            className="mr4"
                                                        />
                                                        {t("Change Password")}
                                                    </div>
                                                </li>
                                            </Link>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Account;
