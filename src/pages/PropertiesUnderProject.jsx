import React from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/common/layout/Index";
import DiscoverProjectProperties from "../components/developerProject/DiscoverProjectProperties";
import useTranslationHook from "../components/hooks/useTranslationHook";

const PropertiesUnderProject = () => {
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
                <title>{t("Property Auction - Discover Page")}</title>
            </Helmet>
            <Layout>
                <DiscoverProjectProperties />
            </Layout>
        </>
    );
};

export default PropertiesUnderProject;
