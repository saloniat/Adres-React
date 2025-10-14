import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createSlug, formatPrice } from "../../../helpers";
import { Link } from "react-router-dom";
import CardTimer from "../../common/CardTimer";
import useTranslationHook from "../../hooks/useTranslationHook";

const LiveCard = ({ ele, syncData }) => {
    const slug = createSlug(
        ele?.property || ele?.id,
        `${ele?.property_name} ${ele?.country}`
    );
    const [proeprtyCurrentStatus, setProeprtyCurrentStatus] = useState({
        label: "Loading...",
        className: "active",
    });
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);

    return (
        <li>
            <figure>
                <img className="slide-fixed" src="img/trans-3x2.png" alt="" />
                <img
                    className="slide-img"
                    src={`${process.env.REACT_APP_AZURE_BLOB_URL}${ele.property_image?.image && ele.property_image?.bucket_name ? `${ele.property_image.bucket_name}/${ele.property_image.image}` : "property_image/default_property.jpg"}`}
                    alt="Dicover Pic"
                />

                <div className="top">
                    <div className="status-info">
                        <span className="total-bid">
                            {t("discover card total bids", {
                                totalBids: syncData?.bid_count || 0,
                            })}
                        </span>
                        <span className="status">
                            <em></em> {t("Live")}
                        </span>
                        {/* <span className={proeprtyCurrentStatus?.className}>
                            {proeprtyCurrentStatus?.label}
                        </span> */}
                    </div>
                </div>
                <div className="bottom">
                    <h6>
                        {lang === "en"
                            ? ele?.property_name
                            : ele?.property_name_ar || ""}
                    </h6>
                    <div className="bid-box">
                        <div className="high-bid">
                            <small>
                                {syncData?.bid_count
                                    ? t("Highest Bid")
                                    : t("Starting Price")}
                            </small>
                            <h5>
                                {syncData
                                    ? t("Amount", {
                                          amount: `${formatPrice(
                                              syncData?.bid_count
                                                  ? syncData?.high_bid_amt
                                                  : syncData?.start_price,
                                              lang
                                          )}`,
                                      })
                                    : t("Loading...")}
                            </h5>
                        </div>

                        {syncData && (
                            <CardTimer
                                data={syncData}
                                onStatusChange={setProeprtyCurrentStatus}
                            />
                        )}
                    </div>
                    <div className="apk">
                        <div className="apk-text">
                            {t(ele?.property_type || "")} <span>|</span>
                            {t(ele?.construction_status_name || "")}
                        </div>
                        <Link
                            to={`/property/detail/${slug}`}
                            className="prp-link"
                        >
                            {t("Property Details")}
                            <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                    </div>

                    <Link
                        to={`/live-feed/${slug}`}
                        className="btn btn-white btn-sm"
                    >
                        {syncData?.my_max_bid_val
                            ? t("Auction Joined")
                            : t("Join Auction")}
                    </Link>
                </div>
            </figure>
        </li>
    );
};

export default LiveCard;
