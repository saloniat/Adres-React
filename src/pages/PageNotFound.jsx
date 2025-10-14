import React from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import Layout from "../components/common/layout/Index";
import WelcomeComponent from "../components/home/section/WelcomeComponent";
import HomePage from "../components/home/HomePage";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { Link } from "react-router-dom";

function NotFound() {
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
                <title>{t("Not Found")}</title>
            </Helmet>
            <Layout>
                <div className="not-found">
                    <h1>{t("404")}</h1>
                    <h4 className="mb-4">
                        {t(
                            "Ooops!!! The page you are looking for is not found"
                        )}
                    </h4>
                    <Link className="btn btn-primary" to="/">
                        {t("Back to home")}
                    </Link>
                </div>
            </Layout>
        </>
    );
}

export default NotFound;
