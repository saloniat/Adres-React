import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "../../components/common/layout/Index";
import StepOneForm from "../../components/seller/property/Auction/StepOneForm";
import Breadcrumb from "../../components/common/Breadcrumb";
import StepTwoForm from "../../components/seller/property/Auction/StepTwoForm";
import { createSlug } from "../../helpers";
import useTranslationHook from "../../components/hooks/useTranslationHook";
import { handleAuctionFormStep } from "../../redux/slice/sellerSlice";
import { handleSwitchAccount } from "../../redux/action/profileAction";
import { ACCOUNT } from "../../utils/constants";

const AddAuctionDetail = () => {
    const navigate = useNavigate();
    const { t } = useTranslationHook();

    const step = useSelector((state) => state.seller.property.auction.step);
    const account = useSelector((state) => state.profile.account);

    const dispatch = useDispatch();
    const { property_name, state, country } = useSelector(
        (state) => state?.seller?.property?.propertyData || {}
    );
    const { id } = useParams();

    useLayoutEffect(() => {
        if (
            location.pathname.includes("seller") &&
            account !== ACCOUNT.Seller
        ) {
            dispatch(handleSwitchAccount(ACCOUNT.Seller));
            sessionStorage.setItem("Account", ACCOUNT.Seller);
        }
    }, []);

    useEffect(() => {
        !step && navigate("/my-properties");
    }, [step, navigate]);

    useEffect(() => {
        return () => {
            dispatch(handleAuctionFormStep(1));
        };
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
                <title>{t("Property Auction - Projects")}</title>
            </Helmet>
            <Layout>
                <Breadcrumb
                    links={[
                        { url: "/", name: t("Home") },
                        { url: "/my-properties", name: t("My Properties") },
                        {
                            url: `/seller/property/detail/${createSlug(
                                id,
                                property_name + " " + country + " " + country
                            )}`,
                            name: t(property_name || ""),
                        },
                        { url: "/my-properties", name: t("Put it on Auction") },
                    ]}
                />
                {step === 1 && <StepOneForm />}
                {step === 2 && <StepTwoForm />}
            </Layout>
        </>
    );
};

export default AddAuctionDetail;
