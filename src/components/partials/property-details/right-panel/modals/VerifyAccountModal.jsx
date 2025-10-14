import React from "react";
import { useNavigate } from "react-router-dom";
import useTranslationHook from "../../../../hooks/useTranslationHook";
const VerifyAccountModal = ({ show, onClose }) => {
    const navigate = useNavigate();
    const { t } = useTranslationHook();

    return (
        <div
            className={`modal fade place-bid-modal ${show ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                    <div className="modal-body pb0">
                        <div className="placebid">
                            <div className="bid-success left">
                                {t("Account Verification Needed")}
                            </div>
                            <ul className="bidlist">
                                <li>
                                    {t(
                                        "To place a bid, please complete your account Verification first."
                                    )}
                                </li>
                            </ul>

                            <div className="button-action">
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
                                    onClick={() => navigate("/verify")}
                                >
                                    {t("Verify Now")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyAccountModal;
