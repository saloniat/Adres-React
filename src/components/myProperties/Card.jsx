import React from "react";
import { Link } from "react-router-dom";
import { MY_PRO_STATUS_CLASS, checkAuctionStatus } from "../../utils/constants";
import { createSlug } from "../../helpers";
import useTranslationHook from "../hooks/useTranslationHook";
import useCountdownTimer from "../hooks/useCountdownTimer";
import { useSelector } from "react-redux";

const Card = ({ ele }) => {
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);
    const {
        id,
        seller_status_name,
        // name: property_name,
        property_name,
        property_name_ar,
        project_name,
        project_name_ar,
        state_name,
        community,
        community_ar,
        country,
        property_image: { image, bucket_name },
        seller_status,
        closing_status_name: closingStatus,
        status_id,
    } = ele;
    const getStatusClass = () => {
        switch (seller_status_name) {
            case MY_PRO_STATUS_CLASS.READY:
                return "status status-success";
            case MY_PRO_STATUS_CLASS.UNDER_REVIEW:
                return "status default-success";
            default:
                return "status info-success";
        }
    };
    const slug = createSlug(id, `${property_name} ${country}`);
    const isAuction = checkAuctionStatus(seller_status);

    const highestBid = ele?.highest_bid;
    const reserveAmount = ele?.reserve_amount;

    const propertyClosedStatus =
        status_id !== 1
            ? highestBid > reserveAmount
                ? "Closed"
                : closingStatus
            : null;
    const { status } = useCountdownTimer(ele?.bidding_start, ele?.bidding_end);

    const isAuctionRunning =
        ele?.seller_status == 24 ||
        ele?.seller_status == 29 ||
        ((ele?.seller_status == 27 || ele?.seller_status == 28) &&
            status === "nearby_to_close") ||
        status === "running";

    return (
        <li>
            <Link to={`/seller/property/detail/${slug}`}>
                <figure>
                    <img
                        className="slide-fixed"
                        src="/img/trans-3x2.png"
                        alt=""
                    />
                    <img
                        className="slide-img"
                        src={`${process.env.REACT_APP_AZURE_BLOB_URL}${image && bucket_name ? `${bucket_name}/${image}` : "property_image/default_property.jpg"}`}
                        alt="Discover Pic"
                    />
                </figure>
            </Link>
            <figcaption>
                <div className="top">
                    <span
                        className={`status ${propertyClosedStatus === "Closed" ? "default-success" : propertyClosedStatus ? "info-success" : getStatusClass()}`}
                    >
                        {t(propertyClosedStatus || seller_status_name)}
                    </span>
                    <div className="action-icon">
                        <span className="view-list">
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                            <ul>
                                {status !== "nearby_to_close" &&
                                    status !== "running" && (
                                        <li>
                                            <Link
                                                to={`/seller/property/${slug}`}
                                            >
                                                <i className="fas fa-edit"></i>
                                                {t("Edit Property")}
                                            </Link>
                                        </li>
                                    )}
                                {(ele?.seller_status == 27 ||
                                    ele?.seller_status == 28) && (
                                    <li>
                                        <Link
                                            to={`/seller/auction/detail/${slug}`}
                                        >
                                            <i className="fas fa-edit"></i>
                                            {t("Edit Auction")}
                                        </Link>
                                    </li>
                                )}
                                {/*<li>*/}
                                {/*    <a href="void:{0}">*/}
                                {/*        <i className="fas fa-trash"></i>2*/}
                                {/*    </a>*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                {/*    <a href="void:{0}">*/}
                                {/*        <i className="fas fa-share"></i>3*/}
                                {/*    </a>*/}
                                {/*</li>*/}
                            </ul>
                        </span>
                    </div>
                </div>
                <h6>
                    {t(
                        lang === "en"
                            ? property_name || ""
                            : property_name_ar || ""
                    )}
                </h6>
                {seller_status_name === MY_PRO_STATUS_CLASS.READY && (
                    <div className="msg success-msg">
                        {t("Your property is ready to publish")}
                    </div>
                )}
                {seller_status_name === MY_PRO_STATUS_CLASS.ON_AUCTION &&
                    status_id === 1 && (
                        <div className="msg success-msg">
                            {t("Your property is now live on auction")}
                        </div>
                    )}
                <div className="location">
                    <span className="map-icon">
                        <img src="/img/map-icon.svg" alt="" />
                    </span>{" "}
                    {t(state_name)} -{" "}
                    {t(lang === "en" ? community : community_ar || "")}
                </div>
                {(lang === "en" ? project_name : project_name_ar) ? (
                    <div className="deposit-text">
                        {t("Project")}:{" "}
                        <span>
                            {t(lang === "en" ? project_name : project_name_ar)}
                        </span>
                    </div>
                ) : (
                    <></>
                )}
            </figcaption>
        </li>
    );
};

export default Card;
