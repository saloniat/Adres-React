import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toggleFavouriteStatus } from "../../redux/slice/buyerSlice";
import { removeFavourite } from "../../redux/slice/profileSlice";
import { togglePropertyLike } from "../../redux/action/sellerAction";
import { toggleBidFavouriteStatus } from "../../redux/slice/bidSlice";
import useTranslationHook from "../hooks/useTranslationHook";

const LikeButton = ({ propertyId, isInitiallyLiked, user, isFavourite }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const [isLiked, setIsLiked] = useState(isInitiallyLiked);
    const { t } = useTranslationHook();

    useEffect(() => {
        setIsLiked(isInitiallyLiked);
    }, [isInitiallyLiked]);

    const submitReaction = () => {
        setIsLiked((prev) => !prev);
        dispatch(toggleFavouriteStatus(propertyId));
        dispatch(toggleBidFavouriteStatus(propertyId));
        const formData = {
            domain: 3,
            property: propertyId,
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
        if (isFavourite) dispatch(removeFavourite(propertyId));
        submitReaction();
    };

    const handleModalCancel = () => {
        window.bootstrap.Modal.getInstance(modalRef.current).hide();
    };

    return (
        <>
            <button onClick={handleReaction}>
                <img
                    src={`/img/${isLiked ? "heart-icon-r" : "heart-icon"}.svg`}
                    alt=""
                />
            </button>

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

export default LikeButton;
