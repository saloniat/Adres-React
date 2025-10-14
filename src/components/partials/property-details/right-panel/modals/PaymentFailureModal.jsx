import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateFailedPaymentStatus } from "../../../../../redux/action/buyerAction";
const PaymentFailureModal = ({
    show,
    onClose,
    transactionId,
    failureMsg,
    paymentErrorText,
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        try {
            dispatch(updateFailedPaymentStatus(transactionId)).then(
                (response) => {
                    console.log("Update Failed Payment Status:", response);
                }
            );
        } catch (error) {
            console.error("One of the requests failed:", error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionId]);
    return (
        <div
            className={`modal fade place-bid-modal ${show ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog modal-md modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body pb0">
                        <div className="placebid">
                            <figure className="tick pb-3">
                                <img src="/img/close-l.svg" alt="" />
                            </figure>
                            <div className="bid-success">
                                {/* We encountered an issue while processing your
                                payment. */}
                                {failureMsg}
                                <span>{paymentErrorText}</span>
                            </div>

                            <div className="clearfix">
                                <button
                                    onClick={onClose}
                                    className="btn btn-primary btn-md btn-full"
                                >
                                    {"Return to Details"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailureModal;
