import React from "react";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";

const Loader = () => {
    const siteLoader = useSelector((state) => state.auth.siteLoader);

    if (!siteLoader) return <></>;
    return <Spinner />;
};

export default Loader;
