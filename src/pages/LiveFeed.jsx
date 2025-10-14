import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "../components/common/layout/Index";
import LiveFeedCard from "../components/home/common/LiveFeedCard";
import Breadcrumb from "../components/common/Breadcrumb";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { fetchPropertyDetail } from "../redux/action/sellerAction";
import { handleViewProperty } from "../redux/action/profileAction";

const LiveFeed = () => {
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: propertyId } = useParams();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/sign-in");
        }
    }, [isAuthenticated, navigate, t]);

    useEffect(() => {
        if (!propertyId || isNaN(Number(propertyId))) {
            toast.error(t("Invalid property id"));
            return navigate("/not-found");
        }
        dispatch(fetchPropertyDetail(propertyId));
        if (isAuthenticated) {
            dispatch(
                handleViewProperty({
                    ...(user?.site_id && {
                        site_id: user.site_id,
                    }),
                    ...(user?.user_id && {
                        user_id: user.user_id,
                    }),
                    property_id: propertyId,
                })
            );
        }
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
                <Breadcrumb
                    links={[
                        { url: "/", name: t("Home") },
                        { url: "/discover", name: t("Discover") },
                        { url: "", name: t("Live Feed") },
                    ]}
                />
                <LiveFeedCard />
            </Layout>
        </>
    );
};

export default LiveFeed;
