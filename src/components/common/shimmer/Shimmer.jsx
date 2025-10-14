import React from "react";

const Shimmer = ({ type, className, ...rest }) => {
    return (
        <div
            className={`shimmer ${type} ${className || ""}`}
            style={{ ...rest }}
        />
    );
};

export default Shimmer;
