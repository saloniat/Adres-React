import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { buyNowProperty } from "../../../../../redux/action/sellerAction";
import { formatNumber } from "../../../../../helpers";
import SocketService from "../../../../../Service/SocketService";
import useTranslationHook from "../../../../hooks/useTranslationHook";
import { handleHighestBidderModal } from "../../../../../redux/slice/modalSlice";

const HighestBidConfirmationModal = ({ confirmBtnClick }) => {
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    const highestBidderModal = useSelector(
        (state) => state.modal.highestBidderModal
    );
    const highestBidder = useSelector(
        (state) => state.bidHistory.highestBidder
    );

    const handleClose = () => {
        dispatch(handleHighestBidderModal(false));
    };
    if (!highestBidderModal) return <></>;
    return (
        <div
            className={`modal fade place-bid-modal ${highestBidderModal ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>{t("Choose Highest Bid")}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body pb0">
                        <div className="placebid">
                            <p className="text">
                                {t(
                                    "Are you sure you want to designate this bidder as the highest bidder?"
                                )}
                            </p>
                            {/* )} */}

                            <div className="bid-block">
                                <div className="price">
                                    {t("Price")}{" "}
                                    <span>
                                        {t("Amount", {
                                            amount: formatNumber(
                                                highestBidder.amount
                                            ),
                                        })}
                                    </span>
                                </div>
                                <div className="price">
                                    {t("Highest bidder")}{" "}
                                    <span>{highestBidder.name}</span>
                                </div>
                            </div>

                            <div className="button-action">
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-white btn-gray btn-lg"
                                        onClick={handleClose}
                                    >
                                        {t("Cancel")}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg"
                                        onClick={confirmBtnClick}
                                    >
                                        {t("Confirm")}
                                    </button>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighestBidConfirmationModal;
