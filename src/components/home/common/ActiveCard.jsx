import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LikeButton from "../../common/LikeButton";
import { Link } from "react-router-dom";
import { createSlug, formatPrice } from "../../../helpers";
import CardTimer from "../../common/CardTimer";
import useTranslationHook from "../../hooks/useTranslationHook";
import { removeFavourite } from "../../../redux/slice/profileSlice";
import { toast } from "react-toastify";
import { togglePropertyLike } from "../../../redux/action/sellerAction";
import { toggleFavouriteStatus } from "../../../redux/slice/buyerSlice";
import { toggleBidFavouriteStatus } from "../../../redux/slice/bidSlice";

const ActiveCard = ({ ele, syncData }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);

    const slug = createSlug(
        ele?.property || ele?.id,
        `${ele?.property_name} ${ele?.country}`
    );

    const isHighestBidder =
        Number(syncData?.max_bidder_user_id) === Number(user?.user_id);
    const [proeprtyCurrentStatus, setProeprtyCurrentStatus] = useState({
        label: "Loading...",
        className: "active",
    });

    const dispatch = useDispatch();
    const modalRef = useRef(null);
    const [isLiked, setIsLiked] = useState(ele?.is_favourite || false);
    // useEffect(() => {
    //     setIsLiked(ele?.is_favourite || false);
    // }, [ele?.is_favourite]);

    const submitReaction = () => {
        setIsLiked((prev) => !prev);
        dispatch(toggleFavouriteStatus(ele.id));
        dispatch(toggleBidFavouriteStatus(ele.id));
        const formData = {
            domain: 3,
            property: ele?.id,
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
        e.stopPropagation();
        if (user?.user_id) {
            if (!isLiked) {
                submitReaction();
            } else {
                new window.bootstrap.Modal(modalRef.current).show();
            }
        } else {
            navigate("/sign-in");
        }
    };

    const handleModalConfirm = () => {
        window.bootstrap.Modal.getInstance(modalRef.current).hide();
        if (ele?.is_favourite) dispatch(removeFavourite(ele.id));
        submitReaction();
    };

    const handleModalCancel = () => {
        window.bootstrap.Modal.getInstance(modalRef.current).hide();
    };

    return (
        <>
            <li>
                <figure>
                    <Link to={`/${ele?.property_for === 2 && ele?.status_id === 1 ? "live-feed" : "property/detail"}/${slug}`}>

                        <img
                            className="slide-fixed"
                            src="img/trans-3x2.png"
                            alt=""
                        />
                        <img
                            className="slide-img"
                            src={`${process.env.REACT_APP_AZURE_BLOB_URL}${ele.property_image?.image && ele.property_image?.bucket_name ? `${ele.property_image.bucket_name}/${ele.property_image.image}` : "property_image/default_property.jpg"}`}
                            alt="Dicover Pic"
                        />
                        {syncData?.my_max_bid_val && (
                            <div className="msg-status">
                                <div
                                    className={
                                        isHighestBidder
                                            ? "msg success-msg"
                                            : "msg danger-msg"
                                    }
                                >
                                    <i
                                        className={
                                            isHighestBidder
                                                ? "fa-solid fa-angles-up"
                                                : "fa-solid fa-angles-down"
                                        }
                                    ></i>{" "}
                                    {isHighestBidder
                                        ? t("You’re Leading")
                                        : t("Out of the Lead")}
                                </div>
                            </div>
                        )}
                    </Link>
                </figure>
                <figcaption>
                    <div className="top">
                        <div className="status-info">
                            <span className="total-bid">
                                {t("discover card total bids", {
                                    totalBids: syncData?.bid_count,
                                })}
                            </span>
                            <span className={proeprtyCurrentStatus?.className}>
                                {t(proeprtyCurrentStatus?.label)}
                            </span>
                        </div>
                        <div className="like-btn">
                            <button onClick={handleReaction}>
                                <img
                                    src={`/img/${isLiked ? "heart-icon-r" : "heart-icon"}.svg`}
                                    alt=""
                                />
                            </button>
                            {/* <LikeButton
                                propertyId={ele?.id}
                                isInitiallyLiked={ele?.is_favourite || false}
                                user={user}
                                isFavourite={ele?.is_favourite}
                            /> */}
                        </div>
                    </div>
                    <h6>{t(ele?.property_name)}</h6>
                    <div className="location">
                        <span className="map-icon">
                            <img src="img/map-icon.svg" alt="" />
                        </span>{" "}
                        {t(ele?.state_name)} -{" "}
                        {t(
                            lang === "en"
                                ? ele?.community
                                : ele?.community_ar || ""
                        )}
                    </div>

                    <div className="bottom">
                        {proeprtyCurrentStatus?.label !== "Closed" && (
                            <div className="high-bid">
                                <small>
                                    {syncData?.bid_count
                                        ? t("Highest Bid")
                                        : t("Starting Price")}
                                </small>
                                <h5>
                                    {syncData
                                        ? t("Amount", {
                                            amount: formatPrice(
                                                syncData?.bid_count
                                                    ? syncData?.high_bid_amt
                                                    : syncData?.start_price,
                                                lang
                                            ),
                                        })
                                        : t("Loading...")}
                                </h5>
                            </div>
                        )}
                        {syncData && (
                            <CardTimer
                                data={syncData}
                                onStatusChange={setProeprtyCurrentStatus}
                            />
                        )}
                    </div>
                    <div className="bid-btn">
                        <button
                            onClick={() => navigate(`/property/detail/${slug}`)}
                            className="btn btn-primary btn-md"
                            disabled={isHighestBidder ? true : false}
                        >
                            <img
                                src="img/raise-icon.svg"
                                className="mr4"
                                alt=""
                            />{" "}
                            {syncData?.my_max_bid_val
                                ? t("Raise your bid")
                                : t("Place a bid")}
                        </button>
                    </div>
                </figcaption>
            </li>
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
                                className="btn btn-sky btn-md width50"
                                onClick={handleModalCancel}
                            >
                                {t("Cancel")}
                            </button>
                            <button
                                className="btn btn-primary btn-md width50"
                                onClick={handleModalConfirm}
                            >
                                {t("Remove")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ActiveCard;
