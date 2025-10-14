import React, { useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "../../components/common/layout/Index";
import StepOneForm from "../../components/seller/property/StepOneForm";
import StepTwoForm from "../../components/seller/property/StepTwoForm";
import StepThreeForm from "../../components/seller/property/StepThreeForm";
import StepFourForm from "../../components/seller/property/StepFourForm";
import PropertyReview from "../../components/seller/property/PropertyReview";
import Breadcrumb from "../../components/common/Breadcrumb";
import {
    fetchPropertyDetail,
    resetDistricts,
    resetCommunitys,
    setFormStep,
} from "../../redux/action/sellerAction";
import useTranslationHook from "../../components/hooks/useTranslationHook";
import { ACCOUNT } from "../../utils/constants";
import { handleSwitchAccount } from "../../redux/action/profileAction";
const AddPropertyDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslationHook();
    const account = useSelector((state) => state.profile.account);

    const {
        step,
        stepTwoData: { property_name },
    } = useSelector((state) => state.seller.property);
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
        if (!id && !step) {
            navigate("/my-properties");
        } else if (id && !step) {
            dispatch(fetchPropertyDetail(id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, step]);

    useEffect(() => {
        dispatch(resetDistricts());
        dispatch(resetCommunitys());
        return () => {
            dispatch(setFormStep(null));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return !step ? null : (
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
                            url: "",
                            name: t(property_name) || t("Add New Property"),
                        },
                    ]}
                />
                {step === 1 && <StepOneForm />}
                {step === 2 && <StepTwoForm />}
                {step === 3 && <StepThreeForm />}
                {step === 4 && <StepFourForm />}
                {step === 5 && <PropertyReview />}
            </Layout>
        </>
    );
};

export default AddPropertyDetail;
