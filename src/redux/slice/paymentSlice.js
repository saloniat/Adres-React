import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    paymentId: null,
    paymentUrl: null,
    isLoading: false,
};

export const paymentSlice = createSlice({
    name: "paymentSlice",
    initialState,
    reducers: {
        setLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        setPaymentDetails: (state, { payload }) => {
            const { paymentId, paymentUrl } = payload;
            state.paymentId = paymentId;
            state.paymentUrl = paymentUrl;
        },
        resetPaymentState: (state) => {
            state.paymentId = null;
            state.isLoading = false;
            state.paymentUrl = null;
        },
    },
});

export const { setLoading, setPaymentDetails, resetPaymentState } =
    paymentSlice.actions;

export default paymentSlice;
