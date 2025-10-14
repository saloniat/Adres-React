import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StartPurchaseOrForefitProperty } from "../../redux/action/sellerAction";
import { formatNumber } from "../../helpers";
import SocketService from "../../Service/SocketService";
import useTranslationHook from "../hooks/useTranslationHook";

const StartBuyingProcessModal = ({
    show,
    onClose,
    isPurchased,
    setIsPurchased,
    setIsForeFitted,
    bidPrice,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslationHook();

    const [isSubmiting, setIsSubmiting] = useState(false);
    const { account: isSeller } = useSelector((state) => state.profile);
    const { user_id } = useSelector((state) => state.auth.user) || {};
    let lang = useSelector((state) => state.translation.lang);
    const { id, deposit_amount } = useSelector(
        (state) => state.seller.property.propertyData
    );

    const handleSubmit = () => {
        if (!user_id || isSeller !== 0) navigate("/sign-in");
        setIsSubmiting(true);
        dispatch(StartPurchaseOrForefitProperty(id)).then(({ data }) => {
            if (!data?.error) {
                setIsPurchased(true);
                setIsForeFitted(false);
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
                        {!isPurchased && <h5>{t("Continue with purchase")}</h5>}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body pb0">
                        <div className="placebid">
                            {isPurchased ? (
                                <>
                                    <p className="text-center">
                                        <img
                                            src="/img/check-L.svg"
                                            alt="Check icon"
                                        />
                                    </p>
                                    <h6 className="text-center pb10">
                                        {t(
                                            "Buying request placed successfully"
                                        )}{" "}
                                        <br />{" "}
                                    </h6>
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
                                    {t("Bid Price")}{" "}
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

                            <div className="button-action">
                                {isPurchased ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg btn-full"
                                        onClick={onClose}
                                    >
                                        {"Return to Auction"}
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

export default StartBuyingProcessModal;
