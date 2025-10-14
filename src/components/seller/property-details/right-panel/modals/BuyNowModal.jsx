import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { buyNowProperty } from "../../../../../redux/action/sellerAction";
import { formatNumber } from "../../../../../helpers";
import SocketService from "../../../../../Service/SocketService";
import useTranslationHook from "../../../../hooks/useTranslationHook";

const BuyNowModal = ({ show, onClose, isBought, setIsBought }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslationHook();

    const [isSubmiting, setIsSubmiting] = useState(false);
    const { account: isSeller } = useSelector((state) => state.profile);
    const { user_id } = useSelector((state) => state.auth.user) || {};
    let lang = useSelector((state) => state.translation.lang);
    const { id, deposit_amount, property_auction_data } = useSelector(
        (state) => state.seller.property.propertyData
    );

    const handleSubmit = () => {
        if (!user_id || isSeller !== 0) navigate("/sign-in");
        setIsSubmiting(true);
        dispatch(buyNowProperty(id)).then(({ data }) => {
            if (!data?.error) {
                setIsBought(true);
                SocketService.send("getNotifications", { user_id });
            }
            setIsSubmiting(false);
        });
    };

    return (
        <div
            className={`modal fade place-bid-modal ${show ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        {!isBought && <h5>{t("Buy Now")}</h5>}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body pb0">
                        <div className="placebid">
                            {isBought ? (
                                <>
                                    <p className="text-center">
                                        <img
                                            src="/img/check-L.svg"
                                            alt="Check icon"
                                        />
                                    </p>
                                    <h6 className="text-center pb10">
                                        {t("Buying request placed")} <br />{" "}
                                        {t("successfully")}
                                    </h6>
                                    <p className="text text-center">
                                        {t(
                                            "Stay tuned for updates on the auction status."
                                        )}
                                    </p>
                                </>
                            ) : (
                                <p className="text">
                                    {t(
                                        "Are you sure about buying this property at this price? Our representative will contact you."
                                    )}
                                </p>
                            )}

                            <div className="bid-block">
                                <div className="price">
                                    {t("Price")}{" "}
                                    <span>
                                        {t("Amount", {
                                            amount: formatNumber(
                                                property_auction_data?.[0]
                                                    ?.full_amount,
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

                            <div className="button-action">
                                {isBought ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg btn-full"
                                        onClick={onClose}
                                    >
                                        {"Return to Details"}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-white btn-gray btn-lg"
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

export default BuyNowModal;
