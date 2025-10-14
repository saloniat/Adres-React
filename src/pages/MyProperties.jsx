import React, { useLayoutEffect } from "react";
import Layout from "../components/common/layout/Index";
import { Helmet } from "react-helmet";
import Properties from "../components/myProperties/Properties";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../redux/action/authAction";

const MyProperties = () => {
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    const isProcessIncomplete = useSelector(
        (state) => state.auth?.user?.isProcessIncomplete
    );

    useLayoutEffect(() => {
        if (isProcessIncomplete)
            dispatch(authAction.loadUser({ isProcessIncomplete: false }));
    }, [isProcessIncomplete]);

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
                <title>{t("Property Auction - My Property Page")}</title>
            </Helmet>
            <Layout>
                <Properties />
            </Layout>
        </>
    );
};

export default MyProperties;
