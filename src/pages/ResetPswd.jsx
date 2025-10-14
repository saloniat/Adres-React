import React from "react";
import { Helmet } from "react-helmet";
import ForgotPswdLayout from "../components/common/forgotPswdLayout/Index";
import ResetPswdForm from "../components/forgotPswd/ResetPswdForm";

const ResetPswd = () => {
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
                <title>Property Auction - Reset Password Page</title>
            </Helmet>
            <ForgotPswdLayout>
                <ResetPswdForm />
            </ForgotPswdLayout>
        </>
    );
};

export default ResetPswd;
