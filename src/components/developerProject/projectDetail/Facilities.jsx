import React from "react";
import useTranslationHook from "../../hooks/useTranslationHook";

const Facilities = ({ facilities }) => {
    const { t } = useTranslationHook();

    return (
        <div className="facilities-box space">
            <h6>{t("Facilities")}</h6>
            <ul>
                {facilities.map((facility, index) => (
                    <li key={index}>
                        <span className="icon icon-playground">
                            <img
                                src={`${process.env.REACT_APP_AZURE_BLOB_URL}${facility?.bucket_name || "facility_icon"}/${facility?.doc_file_name || "1735016280.7657394_default_facility.png"}`}
                                alt={facility.name}
                            />
                        </span>
                        {t(facility.name)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Facilities;
