import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerPropertyInterest } from "../../../../../redux/action/buyerAction";
import useTranslationHook from "../../../../hooks/useTranslationHook";
const RegisterInterestModal = ({
    show,
    onClose,
    property,
    setIsRegisteredInterest,
    rememberMeFlag,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    const [rememberMe, setRememberMe] = useState(rememberMeFlag);

    const handleSubmit = async () => {
        const response = await dispatch(
            registerPropertyInterest(property, rememberMe)
        );
        if (response) {
            setIsRegisteredInterest(true);
            onClose();
        }
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
                        <h5>{t("Register Interest Confirmation")}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body pb0">
                        <div className="placebid">
                            <ul className="bidlist">
                                <li>
                                    {t(
                                        "Are you sure you would like to register your interest in this property auction? Once confirmed, we will keep you updated with all the necessary details."
                                    )}
                                </li>
                            </ul>

                            <div className="mb-4">
                                <input
                                    type="checkbox"
                                    className="css-checkbox"
                                    id="dontShowAgainCheckbox"
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor="dontShowAgainCheckbox"
                                    className="css-label"
                                >
                                    {t("Don’t show me this message again")}
                                </label>
                            </div>

                            <div className="button-action">
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
                                >
                                    {t("Confirm")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterInterestModal;
