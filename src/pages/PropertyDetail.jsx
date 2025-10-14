import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { fetchPropertyDetail } from "../redux/action/sellerAction";
import Layout from "../components/common/layout/Index";
import Breadcrumb from "../components/common/Breadcrumb";
import Details from "../components/partials/property-details/Details";
import SellerDetails from "../components/seller/property-details/Details";
import Shimmer from "../components/common/shimmer/Shimmer";
import { toast } from "react-toastify";
import {
    handleSwitchAccount,
    handleViewProperty,
} from "../redux/action/profileAction";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { ACCOUNT } from "../utils/constants";
const PropertyDetail = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);

    const { id: propertyId } = useParams();
    const propertyDetail = useSelector(
        (state) => state.seller.property.propertyData
    );
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const isSeller = useSelector((state) => state.profile.account) === 1;

    useLayoutEffect(() => {
        if (location.pathname.includes("seller/property/detail")) {
            dispatch(handleSwitchAccount(ACCOUNT.Seller));
            sessionStorage.setItem("Account", ACCOUNT.Seller);
        }
    }, []);

    useEffect(() => {
        if (!propertyId || isNaN(Number(propertyId))) {
            toast.error(t("Invalid property id"));
            return navigate("/not-found");
        }
        dispatch(fetchPropertyDetail(propertyId));
        if (isAuthenticated && !isSeller) {
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
    const PropertyDetailsComponent = isSeller ? SellerDetails : Details;

    return (
        <React.Fragment>
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
                <title>{t("Property Auction - Property Details")}</title>
            </Helmet>
            <Layout>
                {propertyDetail?.id !== undefined ? (
                    <>
                        <Breadcrumb
                            links={[
                                { url: "/", name: t("Home") },
                                {
                                    url: isSeller
                                        ? "/my-properties"
                                        : "/discover",
                                    name: isSeller
                                        ? t("My Properties")
                                        : t("Discover"),
                                },
                                {
                                    url: "",
                                    name:
                                        lang === "en"
                                            ? propertyDetail?.property_name
                                            : propertyDetail?.property_name_ar ||
                                              "",
                                },
                            ]}
                        />

                        <PropertyDetailsComponent
                            propertyDetail={propertyDetail}
                        />
                    </>
                ) : (
                    <>
                        {[
                            {
                                type: "rectangle",
                                width: "90%",
                                height: "50vh",
                                borderRadius: "2%",
                                margin: "5% 0% 2% 5%",
                            },
                            {
                                type: "line",
                                width: "90%",
                                height: "6vh",
                                borderRadius: "2%",
                                margin: "0 0 0 5%",
                            },
                            {
                                type: "line",
                                width: "90%",
                                height: "6vh",
                                borderRadius: "2%",
                                margin: "0 0 4% 5%",
                            },
                        ].map((shimmerProps, index) => (
                            <Shimmer
                                key={index}
                                type={shimmerProps.type}
                                width={shimmerProps.width}
                                height={shimmerProps.height}
                                borderRadius={shimmerProps.borderRadius}
                                margin={shimmerProps.margin}
                            />
                        ))}
                    </>
                )}
            </Layout>
        </React.Fragment>
    );
};

export default PropertyDetail;
