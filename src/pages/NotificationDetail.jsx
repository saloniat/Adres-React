import React from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/common/layout/Index";
import Breadcrumb from "../components/common/Breadcrumb";
import Details from "../components/notifications/Details";
import useTranslationHook from "../components/hooks/useTranslationHook";
const NotificationDetail = () => {
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
                <title>{t("Property Auction - Projects")}</title>
            </Helmet>
            <Layout>
                <Breadcrumb
                    links={[
                        { url: "/", name: t("Home") },
                        { url: "/notifications", name: t("Noifications") },
                        { url: "", name: t("Property Review") },
                    ]}
                />
                <Details />
            </Layout>
        </>
    );
};

export default NotificationDetail;
