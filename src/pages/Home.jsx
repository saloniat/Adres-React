import React, { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import Layout from "../components/common/layout/Index";
import WelcomeComponent from "../components/home/section/WelcomeComponent";
import HomePage from "../components/home/HomePage";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { toast } from "react-toastify";

function Home() {
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const { t } = useTranslationHook();

    useLayoutEffect(() => {
        let msg = sessionStorage.getItem("inactiveUser");
        if (msg) {
            toast.error(t("You are not active user."));
            sessionStorage.removeItem("inactiveUser");
        }
    }, []);

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
                <title>{t("Property Auction - Home Page")}</title>
            </Helmet>
            <Layout>
                {isAuthenticated ? <WelcomeComponent /> : <></>}
                <HomePage />
            </Layout>
        </>
    );
}

export default Home;
