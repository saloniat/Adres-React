import React, { useEffect, useRef, useState } from "react";
import {
    createSlug,
    favouritesUrl,
    formatPrice,
    watchlistUrl,
} from "../../helpers";
import { togglePropertyLike } from "../../redux/action/sellerAction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    handleWatchlistPageAction,
    removeFavourite,
} from "../../redux/slice/profileSlice";
import { toggleFavouriteStatus } from "../../redux/slice/buyerSlice";
import { toast } from "react-toastify";
import { toggleBidFavouriteStatus } from "../../redux/slice/bidSlice";
import { DOMAIN } from "../../utils/constants";
import { handleDeleteConfirmationModal } from "../../redux/slice/modalSlice";
import useTranslationHook from "../hooks/useTranslationHook";
import CardTimer from "../common/CardTimer";
const Card = ({ ele, syncData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const user = useSelector((state) => state.auth.user);
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);

    const isFavourite = location.pathname.includes(favouritesUrl);
    const isWatchlist = location.pathname.includes(watchlistUrl);
    const [isLiked, setIsLiked] = useState(ele?.is_favourite || false);
    const [proeprtyCurrentStatus, setProeprtyCurrentStatus] = useState({
        label: "Loading...",
        className: "active",
    });

    useEffect(() => {
        setIsLiked(ele?.is_favourite || false);
    }, [ele]);

    const submitReaction = () => {
        setIsLiked((prev) => !prev);
        dispatch(
            toggleFavouriteStatus(
                isFavourite
                    ? ele?.property
                    : isWatchlist
                      ? ele?.property_id
                      : ele?.id
            )
        );
        dispatch(
            toggleBidFavouriteStatus(
                isFavourite
                    ? ele?.property
                    : isWatchlist
                      ? ele?.property_id
                      : ele?.id
            )
        );
        const formData = {
            domain: DOMAIN,
            ...(isFavourite && ele?.property
                ? { property: ele?.property }
                : isWatchlist && ele?.property_id
                  ? { property: ele?.property_id }
                  : ele?.id && { property: ele?.id }),
            ...(user?.user_id && { user: Number(user.user_id) }),
        };
        dispatch(togglePropertyLike(formData));
        toast.success(
            t(`${isLiked ? "Removed from" : "Added to"} favourite list`),
            {
                autoClose: 1000,
            }
        );
    };

    const handleReaction = (e) => {
        if (user?.user_id) {
            const newIsLiked = !isLiked;
            if (!newIsLiked)
                new window.bootstrap.Modal(modalRef.current).show();
            else submitReaction();
        } else {
            navigate("/sign-in");
        }
    };

    const handleModalConfirm = () => {
        window.bootstrap.Modal.getInstance(modalRef.current).hide();
        if (isFavourite) dispatch(removeFavourite(ele?.property));
        submitReaction();
    };

    const handleModalCancel = () => {
        window.bootstrap.Modal.getInstance(modalRef.current).hide();
    };

    const slug = createSlug(
        ele?.property || ele?.property_id || ele?.id,
        `${ele?.property_name} ${ele?.country}`
    );
    return (
        <>
            <li>
                <figure>
                    <Link to={`/seller/property/detail/${slug}`}>
                        <img
                            className="slide-fixed"
                            src="/img/trans-3x2.png"
                            alt=""
                        />
                        <img
                            className="slide-img"
                            src={`${process.env.REACT_APP_AZURE_BLOB_URL}${ele?.property_image?.image && ele?.property_image?.bucket_name ? `${ele?.property_image.bucket_name}/${ele?.property_image.image}` : "property_image/default_property.jpg"}`}
                            alt="Property Pic"
                        />
                    </Link>
                    <div className="top">
                        <div className="status-info">
                            <span className="total-bid">
                                {t("discover card total bids", {
                                    totalBids: syncData?.bid_count || 0,
                                })}
                            </span>
                            <span className={proeprtyCurrentStatus?.className}>
                                {t(proeprtyCurrentStatus?.label)}
                            </span>
                        </div>
                        <div className="d-flex">
                            <div className="like-btn">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReaction();
                                    }}
                                >
                                    <img
                                        src={`/img/${isLiked ? "heart-icon-r" : "heart-icon"}.svg`}
                                        alt=""
                                    />
                                </button>
                            </div>
                            {isWatchlist && (
                                <div className="like-btn">
                                    <button
                                        onClick={() => {
                                            dispatch(
                                                handleDeleteConfirmationModal(
                                                    true
                                                )
                                            );
                                            dispatch(
                                                handleWatchlistPageAction({
                                                    selectedProperty:
                                                        ele?.property_id,
                                                })
                                            );
                                        }}
                                    >
                                        <img
                                            src="/img/delete-icon.svg"
                                            alt="Delete Icon"
                                        />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bottom">
                        {proeprtyCurrentStatus?.label !== "Closed" &&
                            proeprtyCurrentStatus?.label !== "Under Review" && (
                                <div className="high-bid">
                                    <small>
                                        {syncData?.bid_count
                                            ? t("Highest Bid")
                                            : t("Starting Price")}
                                    </small>
                                    <h6>
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
                                    </h6>
                                </div>
                            )}
                        {syncData && (
                            <CardTimer
                                data={syncData}
                                onStatusChange={setProeprtyCurrentStatus}
                            />
                        )}
                    </div>
                </figure>

                <figcaption>
                    <h6>
                        <Link to={`/property/detail/${slug}`}>
                            {t(ele?.property_name)}
                        </Link>
                    </h6>
                    <div className="location">
                        <span className="map-icon">
                            <img src="/img/map-icon.svg" alt="" />
                        </span>{" "}
                        {`${t(ele?.state_name)} - ${t(lang === "en" ? ele?.community : ele?.community_ar || "")}`}
                    </div>
                    <div className="deposit-text">
                        {t("Deposit")}:{" "}
                        <span>
                            {t("Amount", {
                                amount: `${formatPrice(ele?.deposit_amount, lang)}`,
                            })}
                        </span>
                    </div>
                </figcaption>
                <div className="modal fade" ref={modalRef} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h6 className="modal-title">
                                    {t("Remove from favourite?")}
                                </h6>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb0 sky-text">
                                    {t(
                                        "Are you sure about removing it from your favourite collections?"
                                    )}
                                </p>
                            </div>
                            <div className="d-flex">
                                <button
                                    type="button"
                                    className="btn btn-sky btn-md width50"
                                    data-bs-dismiss="modal"
                                    onClick={handleModalCancel}
                                >
                                    {t("Cancel")}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-md width50"
                                    onClick={handleModalConfirm}
                                >
                                    {t("Remove")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </>
    );
};

export default React.memo(Card);
