import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleVerificationStep } from "../../redux/action/verificationAction";
import { Helmet } from "react-helmet";
import useTranslationHook from "../hooks/useTranslationHook";

const Verify = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    return (
        <>
            <Helmet>
                <meta
                    name="keywords"
                    content={t(
                        "Bidhome-Adres, CRE, brokers, investment, commercial real estate, sales, auction"
                    )}
                />
                <meta
                    name="description"
                    content={t(
                        "Bidhome-Adres brings buyers, sellers, and brokers together to efficiently market and close commercial real estate deals in online CRE auctions."
                    )}
                />
                <title>{t("Property Auction - Verify Account Bidding")}</title>
            </Helmet>
            <section className="login-wrap">
                <div className="container py-5">
                    <div className="row justify-content-md-center">
                        <div
                            className="col-lg-6 wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            <div className="login-box payment-box">
                                <h4 className="display-4 mb-4">
                                    {t("Verify Your Account to Start Bidding")}
                                    <span>
                                        {t(
                                            "To place bids and participate in auctions, you’ll need to complete the one-time account verification"
                                        )}
                                    </span>
                                    <span>
                                        {t(
                                            "You can skip this step for now, but you must verify your account before placing any bids."
                                        )}
                                    </span>
                                </h4>
                                <div className="mb-4">
                                    <Link
                                        to=""
                                        onClick={() =>
                                            dispatch(handleVerificationStep(2))
                                        }
                                        className="btn btn-primary btn-lg btn-full"
                                    >
                                        {t("Yes, Let’s Do it!")}
                                    </Link>
                                </div>
                                <div className="text-center">
                                    <Link to="/" className="skip-text">
                                        {t("Skip for Now")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Verify;
