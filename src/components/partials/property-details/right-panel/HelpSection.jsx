import React from "react";
import useTranslationHook from "../../../hooks/useTranslationHook";

const HelpSection = () => {
    const { t } = useTranslationHook();

    return (
        <div className="need-help">
            <h6>{t("Need Some Help?")}</h6>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at
                sapien vel nisl lobortis rhoncus.
            </p>
            <button className="btn btn-white">{t("Contact Us Now!")}</button>
        </div>
    );
};

const MemoizedHelpSection = React.memo(HelpSection);
MemoizedHelpSection.displayName = "HelpSection";
export default MemoizedHelpSection;
