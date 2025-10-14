import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useTranslationHook from "../hooks/useTranslationHook";
import { handleOtpModal } from "../../redux/slice/profileSlice";
import { otpModalFields } from "../../helpers";
import Input from "../common/form/Input";
import { sendOTP } from "../../redux/action/authAction";
import Button from "../common/Button";
import {
    handleProfileOtpVerify,
    handleProfileUpdate,
} from "../../redux/action/profileAction";

const OtpInputModal = ({ phone_no, phone_country_code, name, email }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setFocus,
        setValue,
        reset,
    } = useForm();
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        timer: 60,
        wrongCodeAttempt: 3,
        isWrongCode: false,
    });
    const { timer } = state;
    const showOptModal = useSelector((state) => state.profile.showOptModal);
    const siteLoader = useSelector((state) => state.auth.siteLoader);
    const remainNoAttempt = useSelector((state) => state.auth.remainNoAttempt);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (showOptModal) {
            setState((prev) => ({
                ...prev,
                timer: 60,
                wrongCodeAttempt: 3,
            }));
        }
    }, [showOptModal]);

    useEffect(() => {
        let countdown = null;

        if (timer > 0) {
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
    }, [timer]);

    useEffect(() => {
        if (state.wrongCodeAttempt === 0) {
            reset();
            dispatch(handleOtpModal(false));
        }
        //eslint-disable-next-line
    }, [state.wrongCodeAttempt]);

    const handleResendCode = () => {
        const body = {
            phone_no: phone_no.replace(/\s/g, ""),
            phone_country_code: phone_country_code,
            ...(user?.user_id && { user_id: user.user_id }),
        };
        dispatch(sendOTP(body, t));
        setState((prev) => ({
            ...prev,
            wrongCodeAttempt: 3,
        }));
        if (!remainNoAttempt) {
            setState((prev) => ({
                ...prev,
                timer: 60,
            }));
        }
    };

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
                                required: t("This field is required"),
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
    const handleOtpInput = async (index, value) => {
        const otpFields = ["otpDigit1", "otpDigit2", "otpDigit3", "otpDigit4"];

        setValue(otpFields[index], value);

        if (value.length === 1 && index < 3) {
            setFocus(otpFields[index + 1]);
        } else if (value.length === 0 && index > 0) {
            setFocus(otpFields[index - 1]);
        }
        const updatedOtpValues = otpFields.map((field) => getValues(field));

        if (updatedOtpValues.every((digit) => digit && digit.length === 1)) {
            const otp = updatedOtpValues.join("");
            const body = {
                otp: otp,
                // phone_no: phone_no.replace(/\s+/g, ""),
                domain_id: 3,
                user_id: user.user_id,
            };
            const res = await dispatch(handleProfileOtpVerify(body));
            if (res.status === 200 && res.data?.error === 0) {
                const profileData = {
                    site_id: user.site_id,
                    user_id: user.user_id,
                    first_name: name,
                    email: email,
                    phone_no: phone_no.replace(/\s+/g, ""),
                    phone_country_code: phone_country_code,
                };
                if (user.email !== email) {
                    dispatch(handleProfileUpdate(profileData, "emailChanged"));
                } else {
                    dispatch(handleProfileUpdate(profileData));
                }
                dispatch(handleOtpModal(false));
            }
            setState((prev) => ({
                ...prev,
                wrongCodeAttempt: prev.wrongCodeAttempt - 1,
                isWrongCode: true,
            }));
        }
    };
    const onSubmit = () => {};
    if (remainNoAttempt || !showOptModal) return <></>;
    return (
        <div
            className={`modal fade ${showOptModal ? "show" : "hide"}`}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            onClick={() => dispatch(handleOtpModal(false))}
                        ></button>
                    </div>
                    <div className="modal-body pb0">
                        <div className="login-wrap">
                            <div className="container py-5">
                                <div className="login-box">
                                    <h4 className="display-4 mb-4">
                                        {t("Enter Verification Code")}
                                        <span>
                                            {t("sent code text", {
                                                dynamicValue: `${phone_country_code} ${phone_no}`,
                                            })}
                                        </span>
                                    </h4>
                                    {otpModalFields.map((item) =>
                                        renderOtpInput(item)
                                    )}

                                    <div className="clear">
                                        <Button
                                            className={
                                                "btn btn-primary btn-full btn-lg"
                                            }
                                            type={"submit"}
                                            disabled={
                                                timer > 0 || remainNoAttempt
                                            }
                                            onClick={() => {
                                                handleResendCode();
                                            }}
                                            label={
                                                timer > 0 &&
                                                !siteLoader &&
                                                !remainNoAttempt
                                                    ? timer >= 60
                                                        ? t(
                                                              "Resend Code text",
                                                              {
                                                                  timer: `${Math.floor(
                                                                      timer / 60
                                                                  )}:${timer % 60 < 10 ? "0" : ""}${
                                                                      timer % 60
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
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpInputModal;
