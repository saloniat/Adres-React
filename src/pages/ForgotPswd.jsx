import React from "react";
import { Helmet } from "react-helmet";
import ForgotForm from "../components/forgotPswd/ForgotForm";
import ForgotPswdLayout from "../components/common/forgotPswdLayout/Index";

const ForgotPswd = () => {
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
                <title>Property Auction - Forgot Password Page</title>
            </Helmet>
            <ForgotPswdLayout>
                <ForgotForm />
            </ForgotPswdLayout>
        </>
    );
};

export default ForgotPswd;
