import React, { useEffect } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { createSlug } from "../../helpers//index";
import { formatPrice } from "../../helpers";
import { useDispatch } from "react-redux";
import useTranslationHook from "../hooks/useTranslationHook";
import { fetchWinningProperty } from "../../redux/action/buyerAction";
import { togglePropertyLike } from "../../redux/action/sellerAction";
import { handleDislikedId } from "../../redux/slice/buyerSlice";
import { handleAuctionWonDeleteConfirmation } from "../../redux/slice/modalSlice";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { toast } from "react-toastify";
const BuyerWonAuction = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const wonAuctions = useSelector((state) => state.buyer.wonAuction?.data);
    const totalWonAuctions = useSelector(
        (state) => state.buyer.wonAuction?.total
    );
    const auctionWonDeleteConfirmation = useSelector(
        (state) => state.modal.auctionWonDeleteConfirmation
    );
    const dislikedId = useSelector((state) => state.buyer.dislikedId);

    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);

    const submitReaction = (id, isLiked = false) => {
        const formData = {
            domain: 3,
            property: id || dislikedId,
            ...(user?.user_id && { user: Number(user.user_id) }),
        };
        dispatch(togglePropertyLike(formData));
        dispatch(
            handleDislikedId({
                id: 0,
                data: wonAuctions.map((item) =>
                    item.id === (id || dislikedId)
                        ? { ...item, is_favourite: !item.is_favourite }
                        : item
                ),
            })
        );

        toast.success(
            t(`${isLiked ? "Added to" : "Removed from"} favourite list`)
        );
    };

    useEffect(() => {
        if (user?.user_id) dispatch(fetchWinningProperty(1, 100));
    }, [user?.user_id]);

    if (!isAuthenticated || !Array.isArray(wonAuctions) || !wonAuctions?.length)
        return <></>;
    return (
        <>
            <section className="wonauction-wrap">
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-12">
                            <ul className="wonauction-list">
                                {wonAuctions?.map((ele, ind) => (
                                    <li
                                        // className={
                                        //     wonAuctions.length > 1 ? "" : "full"
                                        // }
                                        key={ind}
                                    >
                                        <Link
                                            to={`/${
                                                ele?.property_for === 2 &&
                                                ele?.purchase_forefit_status &&
                                                ele?.purchase_forefit_status !==
                                                    2
                                                    ? "auction-winner"
                                                    : "property/detail"
                                            }/${createSlug(ele?.id, `${ele?.community} ${ele?.country}`)}`}
                                        >
                                            <div className="won-box">
                                                <figure>
                                                    <img
                                                        src="/img/prop-trans.png"
                                                        className="slide-fixed"
                                                        alt=""
                                                    />
                                                    <img
                                                        src={
                                                            ele?.property_image
                                                                ?.bucket_name &&
                                                            ele?.property_image
                                                                ?.image
                                                                ? `${process.env.REACT_APP_AZURE_BLOB_URL}${ele.property_image.bucket_name}/${ele.property_image.image}`
                                                                : "/img/discover-pic.jpg"
                                                        }
                                                        className="slide-img"
                                                        alt="Property"
                                                    />
                                                    <div className="won-tag">
                                                        <img
                                                            src="/img/won-tag.svg"
                                                            alt="won tag"
                                                        />
                                                    </div>
                                                    <div className="msg-status">
                                                        <div className="msg success-msg">
                                                            {t("You Won!")}
                                                        </div>
                                                    </div>
                                                </figure>
                                                <figcaption>
                                                    <div className="top">
                                                        <div className="status-info">
                                                            <span className="total-bid">
                                                                {t(
                                                                    "discover card total bids",
                                                                    {
                                                                        totalBids:
                                                                            ele?.bid_count,
                                                                    }
                                                                )}
                                                            </span>
                                                            <span className="default">
                                                                {t("Closed")}
                                                            </span>
                                                            {ele?.purchase_forefit_status ===
                                                            2 ? (
                                                                <span className="danger ">
                                                                    {t(
                                                                        "Forfeited"
                                                                    )}
                                                                </span>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                        <div
                                                            className="like-btn"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                dispatch(
                                                                    handleDislikedId(
                                                                        {
                                                                            id: ele.id,
                                                                        }
                                                                    )
                                                                );
                                                                if (
                                                                    ele.is_favourite
                                                                ) {
                                                                    dispatch(
                                                                        handleAuctionWonDeleteConfirmation(
                                                                            true
                                                                        )
                                                                    );
                                                                } else {
                                                                    submitReaction(
                                                                        Number(
                                                                            ele.id
                                                                        ),
                                                                        true
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <button>
                                                                <img
                                                                    src={
                                                                        ele.is_favourite
                                                                            ? "img/heart-icon-r.svg"
                                                                            : "/img/heart-icon.svg"
                                                                    }
                                                                    alt=""
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <h6>
                                                        {t(
                                                            lang === "en"
                                                                ? ele?.property_name
                                                                : ele?.property_name_ar
                                                        )}
                                                        {/* <span>
                                                        {t("Winning bid")}:{" "}
                                                        {t("Amount", {
                                                            amount: formatPrice(
                                                                ele?.sold_price ||
                                                                    0
                                                            ),
                                                        })}
                                                    </span> */}
                                                    </h6>
                                                    <div className="location">
                                                        <span className="map-icon">
                                                            <img
                                                                src="/img/map-icon.svg"
                                                                alt=""
                                                            />
                                                        </span>
                                                        {`${t(ele?.state_name)} - ${t(lang === "en" ? ele?.community : ele?.community_ar || "")}`}
                                                    </div>

                                                    {ele?.purchase_forefit_status ===
                                                    2 ? (
                                                        <div className="bottom">
                                                            <small>
                                                                {t(
                                                                    "Highest Bid"
                                                                )}
                                                            </small>
                                                            <h5>
                                                                {formatPrice(
                                                                    ele?.highest_bid ||
                                                                        0
                                                                )}
                                                            </h5>
                                                        </div>
                                                    ) : (
                                                        <h6>
                                                            <span>
                                                                {t(
                                                                    "Winning bid"
                                                                )}
                                                                :{" "}
                                                                {t("Amount", {
                                                                    amount: formatPrice(
                                                                        ele?.sold_price ||
                                                                            0
                                                                    ),
                                                                })}
                                                            </span>
                                                        </h6>
                                                    )}

                                                    {ele?.sold_type ===
                                                    "bidding" ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const path =
                                                                    ele?.property_for ===
                                                                        2 &&
                                                                    ele?.purchase_forefit_status &&
                                                                    ele?.purchase_forefit_status !==
                                                                        2
                                                                        ? "auction-winner"
                                                                        : "property/detail";
                                                                navigate(
                                                                    `/${path}/${createSlug(ele?.id, `${ele?.community} ${ele?.country}`)}`
                                                                );
                                                            }}
                                                            disabled={
                                                                ele?.purchase_forefit_status &&
                                                                ele?.purchase_forefit_status ===
                                                                    1
                                                            }
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            {t(
                                                                ele?.purchase_forefit_status &&
                                                                    ele?.purchase_forefit_status ===
                                                                        1
                                                                    ? "Purchase Requested"
                                                                    : ele?.purchase_forefit_status ===
                                                                        2
                                                                      ? "View Details"
                                                                      : "Start Purchase Process"
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </figcaption>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <DeleteConfirmationModal
                title={t("Remove from favourite?")}
                show={auctionWonDeleteConfirmation}
                content={t(
                    "Are you sure about removing it from your favourite collections?"
                )}
                handleModalCancel={() => {
                    dispatch(handleDislikedId({ id: 0 }));
                    dispatch(handleAuctionWonDeleteConfirmation(false));
                }}
                handleModalConfirm={() => {
                    submitReaction();
                    dispatch(handleAuctionWonDeleteConfirmation(false));
                }}
            />
        </>
    );
};

export default BuyerWonAuction;
