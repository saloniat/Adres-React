import React from "react";
import Layout from "../components/common/layout/Index";
import { Helmet } from "react-helmet";
import Auctions from "../components/myAuctions/Auctions";
import useTranslationHook from "../components/hooks/useTranslationHook";

const MyAuctions = () => {
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
                <title>{t("Property Auction - My Property Page")}</title>
            </Helmet>
            <Layout>
                <Auctions />
            </Layout>
        </>
    );
};

export default MyAuctions;
