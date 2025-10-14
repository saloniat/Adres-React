import React, { useEffect, useLayoutEffect } from "react";
import { Helmet } from "react-helmet";

import Layout from "../components/common/layout/Index";
import Breadcrumb from "../components/common/Breadcrumb";
import ChatComponent from "../components/profileSetting/inbox/ChatComponent";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleSwitchAccount } from "../redux/action/profileAction";
import { ACCOUNT } from "../utils/constants";
import { authAction } from "../redux/action/authAction";

function Inbox() {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");

    const isProcessIncomplete = useSelector(
        (state) => state.auth?.user?.isProcessIncomplete
    );

    useLayoutEffect(() => {
        if (isProcessIncomplete)
            dispatch(authAction.loadUser({ isProcessIncomplete: false }));
    }, [isProcessIncomplete]);

    useEffect(() => {
        if (type) {
            if (type === "seller") {
                dispatch(handleSwitchAccount(ACCOUNT.Seller));
            } else {
                dispatch(handleSwitchAccount(ACCOUNT.Buyer));
            }
        }
    }, [type]);

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
                <title>{t("Property Auction - Chat Page")}</title>
            </Helmet>
            <Layout>
                <Breadcrumb
                    links={[
                        { url: "/", name: t("Home") },
                        { url: "/profile-setting", name: t("Profile") },
                        { url: "", name: t("Inbox") },
                    ]}
                />
                <ChatComponent />
            </Layout>
        </>
    );
}

export default Inbox;
