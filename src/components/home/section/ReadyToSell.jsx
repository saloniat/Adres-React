import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleSwitchAccount } from "../../../redux/action/profileAction";
import { ACCOUNT } from "../../../utils/constants";
import { toast } from "react-toastify";
import useTranslationHook from "../../hooks/useTranslationHook";

const ReadyToSell = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { t } = useTranslationHook();

    return (
        <section className="star-wrap mb-5">
            <div className="container">
                <div className="row align-items-center">
                    <div
                        className="offset-lg-1 col-lg-10 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <div className="row align-items-center">
                            <div className="col-lg-8">
                                <h2 className="display-2">
                                    {t("Ready to Sell?")}
                                    <span>
                                        <em>{t("List Your Property")}</em>{" "}
                                        {t("with Us!")}
                                    </span>
                                </h2>
                                <p className="m-0">
                                    {t("Ready To Sell Description")}
                                </p>
                            </div>
                            <div className="col-lg-4">
                                {
                                    user && <div className="star-icon">
                                        <img src="img/star-icon.svg" alt="" />
                                    </div>
                                }
                                <div className="create-auction-btn">
                                    <Link
                                        to={
                                            !user
                                                ? "/sign-in?redirect=/my-properties?createAuction=true"
                                                : "/my-properties?createAuction=true"
                                        }
                                        onClick={() => {
                                            if (user) {
                                                dispatch(
                                                    handleSwitchAccount(
                                                        ACCOUNT.Seller
                                                    )
                                                );
                                                sessionStorage.setItem(
                                                    "Account",
                                                    ACCOUNT.Seller
                                                );
                                            } else {
                                                toast.info(
                                                    t(
                                                        "You need to log in to 'Create New Auction'. Please sign in to continue."
                                                    )
                                                );
                                            }
                                        }}
                                        className={`btn btn-${user ? 'primary' : 'white'} btn-lg`}
                                    >
                                        {t("Create New Auction")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {
                            !user && <div className="row">
                                <div className="col-lg-12">
                                    <div className="item">
                                        <div className="block">
                                            <h5>
                                                {t("Selling at Auction")}
                                            </h5>
                                            <p>
                                               {t("Unlock the full potential of your property by selling to the highest bidder.Explore our guide to maximize your success.")}
                                            </p>
                                            <a href="#" class="link">{t("Get Selling Tips")} <img src="img/arrow-r.svg"
                                                alt="arrow right" class="ml4" /></a>
                                        </div>
                                        <div className="block">
                                            <h5>
                                                {t("Buying at Auction")}
                                            </h5>
                                            <p>
                                               {t("Discover how easy it is to find your perfect property through our seamless auction process. Start your journey with confidence.")}
                                            </p>
                                            <a href="#" className="link">{t("Learn How to Buy")} <img src="img/arrow-r.svg"
                                                alt="arrow right" class="ml4" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReadyToSell;
