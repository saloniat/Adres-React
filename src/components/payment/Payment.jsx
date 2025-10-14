import React, { useCallback } from "react";
import useDidMountEffect from "../hooks/useDidMountEffect";
import { initiatePurchase } from "../../redux/action/paymentAction";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const Payment = ({ slug, amount, property_id }) => {
    const dispatch = useDispatch();
    const isLoading = useSelector(
        (state) => state.payment.isLoading,
        shallowEqual
    );
    const paymentId = useSelector(
        (state) => state.payment.paymentId,
        shallowEqual
    );
    const paymentUrl = useSelector(
        (state) => state.payment.paymentUrl,
        shallowEqual
    );

    useDidMountEffect(() => {
        if (paymentUrl && paymentId)
            window.location.href = `${paymentUrl}?PaymentID=${paymentId}`;
    }, [paymentId, paymentUrl]);

    const handlePurchase = useCallback(() => {
        dispatch(initiatePurchase({ amount, property_id }));
    }, []);

    return (
        <button
            className="btn btn-primary btn-lg"
            onClick={handlePurchase}
            disabled={isLoading}
        >
            {isLoading ? "Processing..." : "Confirm"}
        </button>
    );
};

export default Payment;
