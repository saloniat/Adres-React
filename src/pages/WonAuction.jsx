import React from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/common/layout/Index";
import useTranslationHook from "../components/hooks/useTranslationHook";
import AuctionWinner from "../components/common/AuctionWinner";
import BuyerWonAuction from "../components/common/BuyerWonAuction";
import Breadcrumb from "../components/common/Breadcrumb";

const WonAuction = () => {
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
                <title>{t("Property Auction - Won Auctions Page")}</title>
            </Helmet>
            <Layout>
                <Breadcrumb
                    links={[
                        { url: "/", name: t("Home") },
                        { url: "", name: t("Won Auctions") },
                    ]}
                />
                <BuyerWonAuction />
            </Layout>
        </>
    );
};

export default WonAuction;
