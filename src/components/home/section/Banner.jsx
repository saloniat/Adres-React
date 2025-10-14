import React from 'react'
import LiveAuction from './LiveAuction';
import { Link } from 'react-router-dom';
import useTranslationHook from '../../hooks/useTranslationHook';
import { useSelector } from 'react-redux';

const Banner = () => {
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);
    return (
        <section className="hero-banner">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="item-block">
                            <div className="block">
                                <div className="hero-text">
                                    <h2>
                                        {t("Discover Your")} <br />
                                        {t("Dream")} <span>{t("Property")}.</span>
                                    </h2>
                                    <p>
                                        {t("Exclusive Auctions, Seamless Transactions")}.
                                    </p>
                                    <Link to="/discover" className="btn btn-white">{t("Browse Properties")}</Link>
                                </div>
                            </div>
                            <div class="block">
                                <figure>
                                    <div class="stripe one">
                                        <div className="icon"><img src="/img/tag-icon-1.svg" alt="" /></div> {t("Easy Bidding Experience")}
                                    </div>
                                    <div class="stripe two">
                                        <div className="icon"><img src="/img/tag-icon-2.svg" alt="" /></div> {t("Trusted by Users")}
                                    </div>
                                    <div className="stripe three">
                                        <div className="icon"><img src="/img/tag-icon-3.svg" alt="" /></div> {t("Secure Payments")}
                                    </div>
                                    <img className="pic" src="img/hero.jpg" alt="" />
                                    <div className="circle"></div>
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 offset-lg-1 col-md-12">
                        <div className="live-auction">
                            <LiveAuction />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner
