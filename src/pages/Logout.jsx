import React, { useLayoutEffect } from "react";
import { logout } from "../redux/action/authAction";
import { handleSwitchAccount } from "../redux/action/profileAction";
import { useDispatch, useSelector } from "react-redux";
import { ACCOUNT } from "../utils/constants";

const Logout = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    if (user?.user_type) sessionStorage.setItem("userType", user.user_type);
    useLayoutEffect(() => {
        dispatch(logout());
        dispatch(handleSwitchAccount(ACCOUNT.Buyer));
        // eslint-disable-next-line
    }, []);
    return <></>;
};

export default Logout;
