import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/common/layout/Index";
import SignUpForm from "../components/signup/SignUpForm";
import { useDispatch } from "react-redux";
import { handleSignUpStep } from "../redux/action/authAction";
import useTranslationHook from "../components/hooks/useTranslationHook";

function SignUp() {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    useEffect(() => {
        return () => {
            dispatch(handleSignUpStep(1));
        };
        //eslint-disable-next-line
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
                <title>{t("Property Auction - Signup Page")}</title>
            </Helmet>
            <Layout>
                <SignUpForm />
            </Layout>
            <></>
        </>
    );
}

export default SignUp;
