import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { retractBidBuyer } from "../../../../../redux/action/buyerAction";
import { formatNumber } from "../../../../../helpers";
// import SocketService from "../../../../../Service/SocketService";
import useTranslationHook from "../../../../hooks/useTranslationHook";

const RetractBidModal = ({ show, onClose, isRetractBid, setIsRetractBid }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslationHook();
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [bidPrice, setBidPrice] = useState(0);
    const { account: isSeller } = useSelector((state) => state.profile);
    const { user_id } = useSelector((state) => state.auth.user) || {};
    let lang = useSelector((state) => state.translation.lang);
    const { id, deposit_amount } = useSelector(
        (state) => state.seller.property.propertyData
    );
    console.log("isSeller", isSeller);
    const handleSubmit = () => {
        if (!user_id || isSeller !== 0) navigate("/");
        setIsSubmiting(true);
        dispatch(retractBidBuyer(id)).then(({ status, data }) => {
            if (status === 200) {
                setIsRetractBid(!isRetractBid);
                setBidPrice(data?.data?.latestHighBid || 0);
                // SocketService.send("getNotifications", { user_id });
            }
            setIsSubmiting(false);
        });
    };
    const retractBidModal = useSelector((state) => state.modal.retractBidModal);
    return !retractBidModal ? null : (
        <div
            className={`modal fade place-bid-modal ${show ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        {!isRetractBid && <h5>{t("Retract Bid")}</h5>}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body pb0">
                        <div className="placebid">
                            {isRetractBid ? (
                                <>
                                    <p className="text-center">
                                        <img
                                            src="/img/check-L.svg"
                                            alt="Check icon"
                                        />
                                    </p>
                                    <h6 className="text-center pb10">
                                        {t("You have successfully retract bid")}
                                        <br />
                                    </h6>
                                </>
                            ) : (
                                <p className="text">
                                    {t(
                                        "Are you about retract this bid. Your deposit will be refunded within 7 working days."
                                    )}
                                </p>
                            )}
                            {isRetractBid && (
                                <div className="bid-block">
                                    <div className="price">
                                        {t("Your new bid")}{" "}
                                        <span>
                                            {t("Amount", {
                                                amount: formatNumber(
                                                    bidPrice,
                                                    lang
                                                ),
                                            })}
                                        </span>
                                    </div>
                                    <div className="price">
                                        {t("Deposit Amount Label")}{" "}
                                        <span>
                                            {t("Amount", {
                                                amount: formatNumber(
                                                    deposit_amount,
                                                    lang
                                                ),
                                            })}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="button-action">
                                {isRetractBid ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg btn-full"
                                        onClick={onClose}
                                    >
                                        {t("Return to Auction")}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-sky btn-lg"
                                            onClick={onClose}
                                        >
                                            {t("Cancel")}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-lg"
                                            onClick={handleSubmit}
                                            disabled={isSubmiting}
                                        >
                                            {isSubmiting
                                                ? t("Submiting")
                                                : t("Confirm")}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetractBidModal;
