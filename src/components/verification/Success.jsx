import React from "react";
import { Link } from "react-router-dom";
import useTranslationHook from "../hooks/useTranslationHook";

const Success = () => {
    const { t } = useTranslationHook();

    return (
        <section className="verify-process-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div
                        className="col-lg-6 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <div className="verify-box center">
                            <div className="payment-check mb-3">
                                <img
                                    src="/img/payment-check.svg"
                                    alt="Payment Check"
                                />
                            </div>
                            <h4 className="display-4 mb-4">
                                {t("Verification Successful!")}
                            </h4>
                            <p className="text mb-5">
                                {t("Document Success Review")}
                            </p>
                            <div>
                                <Link
                                    to="/"
                                    className="btn btn-primary btn-lg btn-full"
                                >
                                    {t("Start Browsing")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Success;
