import React from "react";

export default function Button({
    label,
    onClick,
    className,
    labelClassName,
    nextIconClassName,
    backIconClassName,
    ...rest
}) {
    return (
        <button onClick={onClick} className={`${className}`} {...rest}>
            <span className={`${labelClassName}`}>
                {backIconClassName && <i className={backIconClassName}></i>}
                {label}
                {nextIconClassName && <i className={nextIconClassName}></i>}
            </span>
        </button>
    );
}
