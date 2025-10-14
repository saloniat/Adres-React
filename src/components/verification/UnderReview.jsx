import React from "react";
import { Link } from "react-router-dom";
import useTranslationHook from "../hooks/useTranslationHook";

const UnderReview = () => {
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
                                    src="/img/review-Icon.svg"
                                    alt="Payment Check"
                                />
                            </div>
                            <h4 className="display-4 mb-4 center">
                                {t("Verification Under Review")}
                            </h4>
                            <p className="text mb-5 center">
                                {t("Document Under Review")}
                            </p>
                            <div className="center">
                                <Link
                                    to="/"
                                    className="btn btn-primary btn-lg width50"
                                >
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

export default UnderReview;
