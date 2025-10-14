import React from "react";
import { useSelector } from "react-redux";
import BuyerHomePage from "./BuyerHomePage";
import SellerHomePage from "./SellerHomePage";
import { ACCOUNT } from "../../utils/constants";

const HomePage = () => {
    const account = useSelector((state) => state.profile.account);
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    return isAuthenticated && account === ACCOUNT.Seller ? (
        <SellerHomePage />
    ) : (
        <BuyerHomePage />
    );
};

export default HomePage;
