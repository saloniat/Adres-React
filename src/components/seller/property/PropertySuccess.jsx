import React from "react";
import { Link } from "react-router-dom";
import useTranslationHook from "../../hooks/useTranslationHook";
import { CommonLayout } from "../../../pages/AccountVerify";
const PropertySuccess = () => {
    const fragment = window.location.hash;
    const { t } = useTranslationHook();

    return (
        <CommonLayout>
            <section className="propertySuccess-wrap">
                <div className="container py-5">
                    <div className="row justify-content-md-center">
                        <div
                            className="col-lg-6 wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            <div className="propertySuccess-box">
                                <div className="payment-check">
                                    <img
                                        src="/img/payment-check.svg"
                                        alt="Payment Check"
                                    />
                                </div>
                                <h4 className="display-4 mb-4">
                                    {fragment === "#auction"
                                        ? t(
                                              "Your property is now live on auction!"
                                          )
                                        : t(
                                              "Your property has been submitted!"
                                          )}
                                </h4>
                                <p className="text">
                                    {fragment === "#auction"
                                        ? t(
                                              "Your listing is active, and buyers can now place bids. We'll keep you updated on the action."
                                          )
                                        : t(
                                              "It's now under review, and we'll notify you once the review is finished."
                                          )}
                                </p>
                                <div className="clear">
                                    <Link
                                        to="/my-properties"
                                        className="btn btn-primary btn-lg btn-full"
                                    >
                                        {fragment === "#auction"
                                            ? t("View Your Listing")
                                            : t("Return to Homescreen")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </CommonLayout>
    );
};

export default PropertySuccess;
