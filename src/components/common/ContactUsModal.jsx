import React from "react";
import { useSelector } from "react-redux";
import useTranslationHook from "../hooks/useTranslationHook";

const ContactUsModal = ({ title, content, handleModalCancel }) => {
    const { t } = useTranslationHook();

    const contactUsModal = useSelector((state) => state.modal.contactUsModal);
    if (!contactUsModal) {
        return <></>;
    }

    return (
        <>
            <div
                className={`modal fade ${contactUsModal ? "show" : "hide"}`}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body contact-popup pb0">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    onClick={handleModalCancel}
                                ></button>
                            </div>
                            <p className="text-center">
                                <img
                                    src="/img/contact-icon.svg"
                                    alt="Contact Icon"
                                />
                            </p>
                            <h5>{t(title)}</h5>
                            <p className="text">{t(content)}</p>

                            <ul>
                                <li>
                                    <div className="icon">
                                        <img
                                            src="/img/headphone-icon.svg"
                                            alt="Contact Icon"
                                        />
                                    </div>
                                    +971 - XX-XXXXXXX
                                </li>
                                <li>
                                    <div className="icon">
                                        <img
                                            src="/img/envelope-icon.svg"
                                            alt="Contact Icon"
                                        />
                                    </div>
                                    hello@domain.com
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUsModal;
