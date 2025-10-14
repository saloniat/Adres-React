import React from "react";
import useTranslationHook from "../../../hooks/useTranslationHook";

const CustomButton = ({
    label,
    parentClassName = "",
    className,
    onClick,
    image = "",
    disabled = false,
}) => {
    const { t } = useTranslationHook();

    return (
        <div className={`contact-btn ${parentClassName}`}>
            <button
                className={`btn btn-lg btn-full ${className}`}
                onClick={onClick}
                disabled={disabled}
            >
                {image && <img src={image} alt="" className="mr4" />}
                {t(label)}
            </button>
        </div>
    );
};

const MemoizedContactButton = React.memo(CustomButton);

MemoizedContactButton.displayName = "ContactButton";

export default MemoizedContactButton;
