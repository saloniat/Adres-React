import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useTranslationHook from "../../../hooks/useTranslationHook";
import { fetchQuantaAPIData } from "../../../../redux/action/buyerAction";

const ComparableProperties = ({ data }) => {
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    const currentBid = data?.high_bid_amt ?? data?.start_price;
    const previousBidRef = useRef(null);
    const [comparableProperties, setComparableProperties] = useState(5);
    useEffect(() => {
        if (previousBidRef.current !== currentBid) {
            previousBidRef.current = currentBid;
            fetchMultipleEndpoints();
        }
    }, [currentBid]);

    const fetchMultipleEndpoints = async () => {
        try {
            dispatch(fetchQuantaAPIData("average-sale-price")).then(
                (response) => {
                    const avgPrice = response?.[0]?.avgPrice;
                    const percentage = Math.round(
                        ((Number(currentBid) - avgPrice) / avgPrice) * 100
                    );
                    setComparableProperties(percentage);
                }
            );
        } catch (error) {
            console.error("One of the requests failed:", error);
        }
    };

    return (
        <div className="bidder-box-items">
            <ul>
                <li>
                    {t("Current comparable properties")}
                    <span
                        className={
                            comparableProperties > 0
                                ? "success-text"
                                : "danger-text"
                        }
                    >
                        {t(
                            `${comparableProperties < 0 ? "Less" : "High"} Percentage`,
                            {
                                percentage: Math.abs(comparableProperties || 0),
                            }
                        )}
                    </span>
                </li>
            </ul>
        </div>
    );
};

// ✅ Wrap with React.memo() for performance optimization
const MemoizedComparableProperties = React.memo(ComparableProperties);

// ✅ Set display name to fix the warning
MemoizedComparableProperties.displayName = "ComparableProperties";

export default MemoizedComparableProperties;
