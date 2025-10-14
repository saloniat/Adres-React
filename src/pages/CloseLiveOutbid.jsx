import React from "react";
import { Helmet } from "react-helmet";
import LiveAuctionOutbid from "../components/home/common/LiveAuctionOutbid";
import Layout from "../components/common/layout/Index";

const CloseLiveOutbid = () => {
    return (
        <>
            <Helmet>
                <meta
                    name="keywords"
                    content="Bidhome-Adres, CRE, brokers, investment, commercial real estate, sales, auction"
                />
                <meta
                    name="description"
                    content="Bidhome-Adres brings buyers, sellers, and brokers together to efficiently market and close commercial real estate deals in online CRE auctions."
                />
                <title>Property Auction - Outbid</title>
            </Helmet>
            <Layout>
                <LiveAuctionOutbid />
            </Layout>
        </>
    );
};

export default CloseLiveOutbid;
