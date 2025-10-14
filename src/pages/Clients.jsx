import React from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/common/layout/Index";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { Link } from "react-router-dom";

function Clients() {
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
                <title>{t("Clients")}</title>
            </Helmet>

            <Layout>
                <section className="privacy-wrap">
                    <div className="container py-5">
                        <div className="row justify-content-md-center">
                            <div className="col-lg-6 text-center">
                                <h2>{t("We're Coming Soon")}</h2>
                                <p>
                                    {t(
                                        "We’re excited to soon introduce the trusted network of clients who power our online auction platform. From individual sellers to businesses across various industries, our community values transparency, security, and real-time competition. This page will soon highlight the incredible people and organizations that make our auction ecosystem thrive. Stay tuned — we're just getting started!"
                                    )}
                                </p>
                                <Link to={"/"}>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                    >
                                        {t("Back to home")}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}

export default Clients;
