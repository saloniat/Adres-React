import React from "react";
import { useSelector } from "react-redux";
import useTranslationHook from "../hooks/useTranslationHook";

const DeleteConfirmationModal = ({
    title,
    content,
    handleModalCancel,
    handleModalConfirm,
    show,
}) => {
    const { t } = useTranslationHook();

    const deleteConfirmationModal = useSelector(
        (state) => state.modal.deleteConfirmationModal
    );
    if (!(show ?? deleteConfirmationModal)) {
        return <></>;
    }

    return (
        <>
            <div
                className={`modal fade ${(show ?? deleteConfirmationModal) ? "show" : "hide"}`}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title">{title}</h6>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                onClick={handleModalCancel}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p className="mb0 sky-text">{content}</p>
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

export default DeleteConfirmationModal;
