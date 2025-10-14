import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "../components/common/layout/Index";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { fetchPropertyDetail } from "../redux/action/sellerAction";
import AuctionWinner from "../components/common/AuctionWinner";

const LiveAuctionWon = () => {
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: propertyId } = useParams();

    useEffect(() => {
        if (!propertyId || isNaN(Number(propertyId))) {
            toast.error(t("Invalid property id"));
            return navigate("/not-found");
        }
        dispatch(fetchPropertyDetail(propertyId));
        //eslint-disable-next-line
    }, [propertyId]);

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
                <title>{t("Property Auction - Live Auction Page")}</title>
            </Helmet>
            <Layout>
                <AuctionWinner />
            </Layout>
        </>
    );
};

export default LiveAuctionWon;
