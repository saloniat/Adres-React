import React from "react";
import Shimmer from "./shimmer/Shimmer";
import useTranslationHook from "../hooks/useTranslationHook";

const Tabs = ({
    tab,
    data,
    Component,
    className,
    fetchData,
    activeTab,
    isLoading = false,
    syncData = [],
    isAuction = false,
}) => {
    const { t } = useTranslationHook();

    return (
        <div>
            <ul className="nav nav-pills mb-4" id="pills-tab1" role="tablist">
                {tab?.map(({ label, key }, index) => (
                    <li className="nav-item" role="presentation" key={index}>
                        <button
                            className={`nav-link ${activeTab === key ? "active" : ""}`}
                            data-bs-toggle="pill"
                            data-bs-target={`#tab-${key}`}
                            type="button"
                            role="tab"
                            aria-controls={`tab-${key}`}
                            aria-selected={activeTab === key}
                            onClick={() => {
                                if (fetchData) fetchData(key);
                            }}
                        >
                            {t(label)}
                        </button>
                    </li>
                ))}
            </ul>
            {isLoading ? (
                [1, 2, 3].map((element, index) => (
                    <Shimmer
                        key={index}
                        type="rectangle"
                        width="31%"
                        height="50vh"
                        borderRadius="10%"
                    />
                ))
            ) : (
                <div className="tab-content" id="pills-tabContent1">
                    {tab?.map(({ key }, index) => (
                        <div
                            key={index}
                            className={`tab-pane fade ${activeTab === key ? "show active" : ""}`}
                            id={`tab-${key}`}
                            role="tabpanel"
                            aria-labelledby={`tab-${key}`}
                        >
                            <ul className={className}>
                                {data?.length ? (
                                    data?.map((ele, ind) => (
                                        <Component
                                            ele={ele}
                                            key={ind}
                                            syncData={
                                                syncData?.filter(
                                                    ({ property_id }) =>
                                                        property_id ===
                                                        Number(ele?.property_id)
                                                )?.[0]
                                            }
                                        />
                                    ))
                                ) : (
                                    <li className="full text-center">
                                        <img
                                            src="/img/no-property-found.png"
                                            alt={t(
                                                `No ${isAuction ? "auctions" : "properties"} found`
                                            )}
                                        />
                                        <h6>
                                            {t(
                                                `No ${isAuction ? "auctions" : "properties"} found`
                                            )}
                                        </h6>
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tabs;
