import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTranslationHook from "../../components/hooks/useTranslationHook";
import { fetchQuantaAPIData } from "../../redux/action/buyerAction";
const AreaComparision = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);
    const [area, setArea] = useState(321);
    const { beds, district, square_footage, district_ar } = useSelector(
        (state) => state.seller.property.propertyData
    );
    useEffect(() => {
        const endpoint = "area-comparison";
        try {
            dispatch(fetchQuantaAPIData(endpoint)).then((response) => {
                // console.log("Area Comparison Response:", response);
                const apiArea =
                    response?.[0]?.projectAvgAreaSqm ||
                    response?.[0]?.districtAvgAreaSqm;
                const comparedPropertyArea =
                    ((square_footage - apiArea) / apiArea) * 100;
                setArea(parseInt(comparedPropertyArea) || 0);
            });
        } catch (error) {
            console.error("One of the requests failed:", error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="biggerprop">
            <img src="/img/ruler-icon.svg" alt="" />
            {t("This property is")}{" "}
            <strong>
                {area && area > 0
                    ? t("Bigger Percentage", {
                          percentage: area,
                      })
                    : t("Smaller Percentage", {
                          percentage: area || 0,
                      })}
                {/* {area || 0}% {area > 0 ? "bigger" : "smaller"} */}
            </strong>{" "}
            {beds === 0
                ? t("than the average studio size of a bedroom in")
                : t(`than the average size label`, {
                      beds,
                  })}{" "}
            {lang === "en" ? district : district_ar}
        </div>
    );
};
export default AreaComparision;
