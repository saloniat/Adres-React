import React from "react";
import {
    MY_PRO_STATUS_CLASS,
    checkAuctionStatus,
} from "../../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFormStep } from "../../../redux/action/sellerAction";
import { createSlug } from "../../../helpers";
import Button from "../../common/Button";
import useTranslationHook from "../../hooks/useTranslationHook";
import ShareButton from "../../common/ShareButton";
import useCountdownTimer from "../../hooks/useCountdownTimer";
const MyPropertiesCard = ({ ele }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lang = useSelector((state) => state.translation.lang);

    const { t } = useTranslationHook();
    const { status } = useCountdownTimer(
        ele?.bidding_start ? ele?.bidding_start : 0,
        ele?.bidding_end ? ele?.bidding_end : 0
    );

    const getStatusClass = () => {
        switch (ele.seller_status_name) {
            case MY_PRO_STATUS_CLASS.READY:
                return "status";
            case MY_PRO_STATUS_CLASS.UNDER_REVIEW:
                return "default";
            default:
                return "info";
        }
    };

    const isAuctionRunning =
        ele?.seller_status == 24 ||
        ele?.seller_status == 29 ||
        ((ele?.seller_status == 27 || ele?.seller_status == 28) &&
            status === "nearby_to_close") ||
        status === "running";

    const viewList = [
        ...(status !== "nearby_to_close" && status !== "running"
            ? [{ icon: "fa-edit", name: "Edit Property" }]
            : []),
        ...(ele?.seller_status == 27 || ele?.seller_status == 28
            ? [{ icon: "fa-edit", name: "Edit Auction" }]
            : []),
        // { icon: "fa-trash", name: "Delete" },
        { icon: "fa-share", name: "Share" },
    ];

    const slug = createSlug(ele.id, `${ele.property_name} ${ele.country}`);
    const isAuction = checkAuctionStatus(ele?.seller_status);
    const handleClick = () => {
        dispatch(setFormStep(""));
    };
    if (isAuctionRunning) delete viewList[1];
    const highestBid = ele?.highest_bid;
    const reserveAmount = ele?.reserve_amount;

    const propertyClosedStatus =
        ele?.status_id !== 1
            ? highestBid > reserveAmount
                ? "Closed"
                : ele?.closing_status_name
            : null;

    return (
        <li>
            <Link to={`/seller/property/detail/${slug}`}>
                <figure>
                    <img
                        className="slide-fixed"
                        src="img/prop-trans.png"
                        alt=""
                    />
                    <img
                        className="slide-img"
                        src={`${process.env.REACT_APP_AZURE_BLOB_URL}${ele.property_image?.bucket_name && ele.property_image?.image ? `${ele.property_image?.bucket_name}/${ele.property_image?.image}` : "property_image/default_property.jpg"}`}
                        alt="Dicover Pic"
                    />
                </figure>
            </Link>
            <figcaption>
                <div className="top">
                    <div className="status-info cursor">
                        <span
                            className={`status ${propertyClosedStatus === "Closed" ? "default" : propertyClosedStatus ? "info" : getStatusClass()}`}
                        >
                            {t(
                                propertyClosedStatus ||
                                    ele?.status ||
                                    ele?.seller_status_name
                            )}
                        </span>
                    </div>
                    <div className="action-icon">
                        <span className="view-list">
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                            <ul>
                                {viewList.map((item, ind) => (
                                    <li key={ind}>
                                        {ind === 2 ? (
                                            <ShareButton
                                                shareUrl={window.location.href}
                                                title={
                                                    lang === "en"
                                                        ? ele.property_name
                                                        : ele.property_name_ar
                                                }
                                                icon={item.icon}
                                                name={item.name}
                                            />
                                        ) : (
                                            <Link
                                                to={
                                                    ind === 0
                                                        ? `/seller/property/${slug}`
                                                        : ind === 1 && isAuction
                                                          ? `/seller/auction/detail/${slug}`
                                                          : ""
                                                }
                                                onClick={handleClick}
                                            >
                                                <i
                                                    className={`fas ${item.icon}`}
                                                ></i>
                                                {t(item.name)}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </span>
                    </div>
                </div>
                <h6>
                    {t(
                        lang === "en"
                            ? ele?.property_name
                            : ele?.property_name_ar
                    )}
                </h6>
                {ele.seller_status_name === MY_PRO_STATUS_CLASS.READY && (
                    <div className="msg success-msg">
                        <img
                            src="img/check-icon.svg"
                            alt="Check Icon"
                            className="mr4"
                        />
                        {t("Your property is ready to publish")}
                    </div>
                )}
                {ele.seller_status_name === MY_PRO_STATUS_CLASS.ON_AUCTION &&
                    ele?.status_id === 1 && (
                        <div className="msg success-msg">
                            <img
                                src="img/check-icon.svg"
                                alt="Check Icon"
                                className="mr4"
                            />
                            {t("Your property is now live on auction")}
                        </div>
                    )}
                <div className="location">
                    <span className="map-icon">
                        <img src="img/map-icon.svg" alt="" />
                    </span>{" "}
                    {t(ele.state_name)} -{" "}
                    {t(
                        lang === "en" ? ele?.community : ele?.community_ar || ""
                    )}
                </div>
                {(lang === "en" ? ele.project_name : ele.project_name_ar) ? (
                    <div className="projects-text">
                        {t("Project")}:{" "}
                        <span>
                            {t(
                                lang === "en"
                                    ? ele.project_name
                                    : ele.project_name_ar
                            )}
                        </span>
                    </div>
                ) : (
                    <></>
                )}
                <div className="bid-btn">
                    <Button
                        label={t("View Details")}
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={
                            ele.seller_status_name ===
                            MY_PRO_STATUS_CLASS.UNDER_REVIEW
                        }
                        onClick={() => {
                            navigate(`/seller/property/detail/${slug}`);
                        }}
                    />
                </div>
            </figcaption>
        </li>
    );
};

export default MyPropertiesCard;
