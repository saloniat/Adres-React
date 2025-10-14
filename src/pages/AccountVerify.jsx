import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { accountStatus, VERIFICATION_STEP } from "../utils/constants";
import VerifyAccStep from "../components/verification/VerifyAccStep";
import Layout from "../components/common/layout/Index";
import Verify from "../components/verification/Verify";
import Header from "../components/common/forgotPswdLayout/Header";
import Footer from "../components/common/layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import UnderReview from "../components/verification/UnderReview";
import Success from "../components/verification/Success";
import UnSuccess from "../components/verification/UnSuccess";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { authAction } from "../redux/action/authAction";

export function CommonLayout({ children }) {
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
                <title>{t("Property Auction - Verify Account Process")}</title>
            </Helmet>
            <Header />
            {children}
            <Footer />
            <></>
        </>
    );
}

const AccountVerify = () => {
    const dispatch = useDispatch();
    const verification_step = useSelector(
        (state) => state.verification.verification_step
    );
    const account_status = useSelector(
        (state) => state.verification.account_status
    );
    const user = useSelector((state) => state.auth.user);
    const isProcessIncomplete = useSelector(
        (state) => state.auth?.user?.isProcessIncomplete
    );

    useEffect(() => {
        if (isProcessIncomplete)
            dispatch(authAction.loadUser({ isProcessIncomplete: false }));
    }, [isProcessIncomplete]);

    const statusMapping = {
        [accountStatus.under_review]: <UnderReview />,
        [accountStatus.success]: <Success />,
        [accountStatus.unsuccess]: <UnSuccess />,
    };
    const renderContent = () => {
        if (
            [
                accountStatus.under_review,
                accountStatus.success,
                accountStatus.unsuccess,
            ].includes(user?.is_account_verified)
        ) {
            const statusComponent =
                statusMapping[account_status || user?.is_account_verified];
            if (statusComponent) {
                return <CommonLayout>{statusComponent}</CommonLayout>;
            }
        }

        if (verification_step === VERIFICATION_STEP.step_1) {
            return (
                <Layout>
                    <Verify />
                </Layout>
            );
        }

        return (
            <CommonLayout>
                <VerifyAccStep />
            </CommonLayout>
        );
    };

    return <>{renderContent()}</>;
};
export default AccountVerify;
