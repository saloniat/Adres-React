import React from "react";
import { Link } from "react-router-dom";
import useTranslationHook from "../../hooks/useTranslationHook";
const LiveAuctionOutbid = () => {
    const { t } = useTranslationHook();
    return (
        <section className="propertySuccess-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <div className="propertySuccess-box">
                            <div className="payment-check">
                                <img src="/img/no-bid.svg" alt="No Bid" />
                            </div>
                            <h4 className="display-4 mb-4">
                                {t("You were outbid!")}
                            </h4>
                            <p className="text">
                                {t(
                                    "Auction ended, and no other auctions are live right now. Stay tuned for future listings!"
                                )}
                            </p>
                            <div className="clear">
                                <Link
                                    to="/my-properties"
                                    className="btn btn-sky btn-lg"
                                >
                                    {t("Go Back to Homepage")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveAuctionOutbid;
