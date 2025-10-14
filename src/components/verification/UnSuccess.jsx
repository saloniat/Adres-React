import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    handleAccountStatus,
    handleVerificationStep,
} from "../../redux/action/verificationAction";
import useTranslationHook from "../hooks/useTranslationHook";

const UnSuccess = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { t } = useTranslationHook();

    return (
        <section className="verify-process-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div
                        className="col-lg-6 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <div className="verify-box ">
                            <div className="payment-check center mb-3">
                                <img
                                    src="/img/payment-uncheck.svg"
                                    alt="Payment Check"
                                />
                            </div>
                            <h4 className="display-4 mb-4 center">
                                {t("Verification Unsuccessful")}
                            </h4>

                            <div className="alert alert-rejected" role="alert">
                                <img src="/img/info-icon-ornge.svg" alt="" />{" "}
                                {t("Your submission has been rejected")}
                            </div>

                            <div className="feedback-msg mb-5">
                                <div className="icon">
                                    <img
                                        src="/img/info-icon-ornge.svg"
                                        alt=""
                                    />
                                </div>
                                <h6>{t("Feedback")}</h6>
                                <p>{t(user?.account_rejection_reason)}</p>
                            </div>

                            <div className="mb-3 center">
                                <Link
                                    to="/verify"
                                    className="btn btn-primary btn-lg width50"
                                    onClick={() => {
                                        dispatch(handleVerificationStep(1));
                                        dispatch(handleAccountStatus(31));
                                    }}
                                >
                                    {t("Retry Verification")}
                                </Link>
                            </div>
                            <div className="text-center">
                                <Link to="/" className="skip-text">
                                    {t("Return to Homescreen")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UnSuccess;
